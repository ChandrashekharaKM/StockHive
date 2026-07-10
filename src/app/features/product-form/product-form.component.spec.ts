import { TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../core/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('ProductFormComponent', () => {
  let productServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    productServiceMock = {
      checkSkuExists: vi.fn(),
      getProduct: vi.fn(),
      addProduct: vi.fn(),
      updateProduct: vi.fn()
    };

    routerMock = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'new'
              }
            }
          }
        }
      ]
    }).compileComponents();
  });

  it('should invalidate form if SKU already exists', async () => {
    const fixture = TestBed.createComponent(ProductFormComponent);
    const component = fixture.componentInstance;
    productServiceMock.checkSkuExists.mockResolvedValue(true);

    const skuControl = component.form.get('sku')!;
    skuControl.setValue('DUPLICATE-SKU');

    const validatorFn = component.skuUniqueValidator();
    const result = await validatorFn(skuControl);

    expect(result).toEqual({ skuExists: true });
    expect(productServiceMock.checkSkuExists).toHaveBeenCalledWith('DUPLICATE-SKU', null);
  });

  it('should validate form if SKU is unique', async () => {
    const fixture = TestBed.createComponent(ProductFormComponent);
    const component = fixture.componentInstance;
    productServiceMock.checkSkuExists.mockResolvedValue(false);

    const skuControl = component.form.get('sku')!;
    skuControl.setValue('UNIQUE-SKU');

    const validatorFn = component.skuUniqueValidator();
    const result = await validatorFn(skuControl);

    expect(result).toBeNull();
    expect(productServiceMock.checkSkuExists).toHaveBeenCalledWith('UNIQUE-SKU', null);
  });
});
