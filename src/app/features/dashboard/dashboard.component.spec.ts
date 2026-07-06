import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  describe('isLow (Pure logic test)', () => {
    it('should return true if quantity is exactly at reorder level', () => {
      // We don't need to mount the component or mock services just to test this pure function.
      const component = Object.create(DashboardComponent.prototype);
      
      const result = component.isLow({ quantity: 5, reorderLevel: 5 });
      expect(result).toBe(true);
    });

    it('should return true if quantity is below reorder level', () => {
      const component = Object.create(DashboardComponent.prototype);
      
      const result = component.isLow({ quantity: 3, reorderLevel: 5 });
      expect(result).toBe(true);
    });

    it('should return false if quantity is above reorder level', () => {
      const component = Object.create(DashboardComponent.prototype);
      
      const result = component.isLow({ quantity: 10, reorderLevel: 5 });
      expect(result).toBe(false);
    });

    it('should handle undefined values gracefully', () => {
      const component = Object.create(DashboardComponent.prototype);
      
      const result = component.isLow({ quantity: undefined, reorderLevel: undefined });
      expect(result).toBe(true); // 0 <= 0 is true
    });
  });
});
