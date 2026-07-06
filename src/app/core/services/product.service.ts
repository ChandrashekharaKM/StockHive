import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, runTransaction, query, orderBy, limit } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private fs = inject(Firestore);
  private auth = inject(Auth);

  getProducts(): Observable<Product[]> {
    const ref = collection(this.fs, 'products');
    return collectionData(query(ref, orderBy('name'), limit(100)), { idField: 'id' }) as Observable<Product[]>;
  }

  addProduct(p: Omit<Product, 'id'>) {
    return addDoc(collection(this.fs, 'products'), p);
  }

  updateProduct(id: string, changes: Partial<Product>) {
    return updateDoc(doc(this.fs, 'products', id), changes);
  }

  deleteProduct(id: string) {
    return deleteDoc(doc(this.fs, 'products', id));
  }

  async adjustStock(productId: string, delta: number) {
    const uid = this.auth.currentUser?.uid ?? 'unknown';
    const productRef = doc(this.fs, 'products', productId);

    await runTransaction(this.fs, async (tx) => {
      const snap = await tx.get(productRef);
      if (!snap.exists()) throw new Error('Product not found');
      const current = snap.data()['quantity'] as number;
      const next = current + delta;
      if (next < 0) throw new Error('Quantity cannot go negative');
      tx.update(productRef, { quantity: next });
      const movementRef = doc(collection(this.fs, 'movements'));
      tx.set(movementRef, { productId, delta, at: Date.now(), byUid: uid });
    });
  }
}
