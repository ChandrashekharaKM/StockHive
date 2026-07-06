import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    sku: ['', Validators.required],
    quantity: [0, [Validators.required, Validators.min(0)]],
    reorderLevel: [0, [Validators.required, Validators.min(0)]]
  });

  productId: string | null = null;
  isEditing = false;
  error: string | null = null;

  async ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId && this.productId !== 'new') {
      this.isEditing = true;
      // For simplicity, we just fetch all products and find the one. 
      // In a real app, we'd have a getProduct(id) method.
      const products = await firstValueFrom(this.productService.getProducts().pipe(take(1)));
      const product = products.find(p => p.id === this.productId);
      if (product) {
        this.form.patchValue(product);
        this.form.get('quantity')?.disable(); // Quantity should be adjusted via the dashboard +1/-1 to record movements
      }
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;

    try {
      if (this.isEditing && this.productId) {
        const changes = this.form.value; // Doesn't include disabled quantity
        await this.productService.updateProduct(this.productId, changes);
      } else {
        await this.productService.addProduct(this.form.value as Omit<Product, 'id'>);
      }
      this.router.navigate(['/']);
    } catch (err: any) {
      this.error = err.message;
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
