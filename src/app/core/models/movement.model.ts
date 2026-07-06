export interface Movement {
  id?: string;
  productId: string;
  delta: number;
  at: number; // Date.now()
  byUid: string;
}
