import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
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

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    sku: ['', Validators.required],
    quantity: [0, [Validators.required, Validators.min(0)]],
    reorderLevel: [0, [Validators.required, Validators.min(0)]]
  });

  productId: string | null = null;
  isEditing = false;
  isSubmitting = signal(false);
  error: string | null = null;

  skuUniqueValidator(): AsyncValidatorFn {
    return async (control: AbstractControl): Promise<ValidationErrors | null> => {
      if (!control.value) {
        return null;
      }
      try {
        const exists = await this.productService.checkSkuExists(
          control.value,
          this.isEditing ? this.productId : null
        );
        return exists ? { skuExists: true } : null;
      } catch (err) {
        console.error('Error validating SKU uniqueness', err);
        return null;
      }
    };
  }

  async ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    const skuControl = this.form.get('sku');
    if (skuControl) {
      skuControl.setAsyncValidators([this.skuUniqueValidator()]);
      skuControl.updateValueAndValidity();
    }

    if (this.productId && this.productId !== 'new') {
      this.isEditing = true;
      const product = await firstValueFrom(this.productService.getProduct(this.productId).pipe(take(1)));
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
      const sku = this.form.get('sku')?.value;
      if (sku) {
        const exists = await this.productService.checkSkuExists(
          sku,
          this.isEditing ? this.productId : null
        );
        if (exists) {
          this.error = 'SKU already exists. Please choose a unique SKU.';
          this.isSubmitting.set(false);
          return;
        }
      }

      const payload = {
        ...this.form.getRawValue(),
        quantity: Number(this.form.get('quantity')?.value || 0),
        reorderLevel: Number(this.form.get('reorderLevel')?.value || 0)
      };

      if (this.isEditing && this.productId) {
        const { quantity, ...changes } = payload;
        console.log('Updating product', this.productId, changes);
        await this.productService.updateProduct(this.productId, changes);
      } else {
        console.log('Adding product', payload);
        await this.productService.addProduct(payload);
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
