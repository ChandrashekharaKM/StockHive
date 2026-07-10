import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, docData, doc, addDoc, updateDoc, deleteDoc, runTransaction, writeBatch, query, orderBy, limit, where, getDocs } from '@angular/fire/firestore';
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

  getProduct(id: string): Observable<Product> {
    const ref = doc(this.fs, `products/${id}`);
    return docData(ref, { idField: 'id' }) as Observable<Product>;
  }

  async checkSkuExists(sku: string, excludeProductId?: string | null): Promise<boolean> {
    if (!sku) return false;
    const ref = collection(this.fs, 'products');
    const q = query(ref, where('sku', '==', sku.trim()));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return false;
    if (excludeProductId) {
      return snapshot.docs.some(doc => doc.id !== excludeProductId);
    }
    return true;
  }

  async addProduct(p: Omit<Product, 'id'>) {
    const uid = this.auth.currentUser?.uid ?? 'unknown';
    const batch = writeBatch(this.fs);
    const productRef = doc(collection(this.fs, 'products'));
    batch.set(productRef, p);

    if (p.quantity > 0) {
      const movementRef = doc(collection(this.fs, 'movements'));
      batch.set(movementRef, { productId: productRef.id, delta: p.quantity, at: Date.now(), byUid: uid });
    }
    
    await batch.commit();
    return productRef;
  }

  updateProduct(id: string, changes: Partial<Product>) {
    return updateDoc(doc(this.fs, 'products', id), changes);
  }

  async deleteProduct(id: string) {
    const uid = this.auth.currentUser?.uid ?? 'unknown';
    const productRef = doc(this.fs, 'products', id);

    await runTransaction(this.fs, async (tx) => {
      const snap = await tx.get(productRef);
      if (snap.exists()) {
        const qty = snap.data()['quantity'] as number;
        if (qty > 0) {
          const movementRef = doc(collection(this.fs, 'movements'));
          tx.set(movementRef, { productId: id, delta: -qty, at: Date.now(), byUid: uid });
        }
        tx.delete(productRef);
      }
    });
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
