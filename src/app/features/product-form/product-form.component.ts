import { Component, inject, OnInit, signal } from '@angular/core';
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
  isSubmitting = signal(false);
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.error = null;

    try {
      const payload = {
        ...this.form.value,
        quantity: Number(this.form.get('quantity')?.value || 0),
        reorderLevel: Number(this.form.get('reorderLevel')?.value || 0)
      };

      if (this.isEditing && this.productId) {
        const { quantity, ...changes } = payload;
        console.log('Updating product', this.productId, changes);
        await this.productService.updateProduct(this.productId, changes);
      } else {
        console.log('Adding product', payload);
        await this.productService.addProduct(payload as Omit<Product, 'id'>);
        console.log('Product added successfully!');
      }
      this.router.navigate(['/']);
    } catch (err: any) {
      this.error = err.message;
    } finally {
      this.isSubmitting.set(false);
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
