import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private productService = inject(ProductService);
  auth = inject(AuthService);
  router = inject(Router);

  private products = toSignal(this.productService.getProducts(), { initialValue: [] });
  search = signal('');
  lowStockOnly = signal(false);

  filtered = computed(() => {
    const term = this.search().toLowerCase().trim();
    return this.products()
      .filter(p => !term || p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term))
      .filter(p => !this.lowStockOnly() || p.quantity <= p.reorderLevel);
  });

  isLow(p: { quantity: number; reorderLevel: number }) {
    return p.quantity <= p.reorderLevel;
  }

  adjust(id: string, delta: number) {
    this.productService.adjustStock(id, delta).catch(err => alert(err.message));
  }

  remove(id: string) {
    if (confirm('Delete this product?')) {
      this.productService.deleteProduct(id).catch(err => alert(err.message));
    }
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }

  addProduct() {
    this.router.navigate(['/product', 'new']);
  }

  editProduct(id: string) {
    this.router.navigate(['/product', id]);
  }
}
