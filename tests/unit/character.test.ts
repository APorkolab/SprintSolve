import { describe, it, expect, beforeEach, vi } from 'vitest';
import { character } from '../../src/character';

describe('Character', () => {
  beforeEach(() => {
    // Reset character state before each test
    character.x = 150;
    character.y = 300;
    character.velocity_y = 0;
  });

  describe('initialization', () => {
    it('should have correct default properties', () => {
      expect(character.size).toBe(60);
      expect(character.gravity).toBe(0.5);
      expect(character.jump_strength).toBe(-10);
      expect(character.x).toBe(150);
    });

    it('should be positioned correctly', () => {
      expect(character.x).toBeGreaterThan(0);
      expect(character.y).toBeGreaterThanOrEqual(0);
    });
  });

  describe('jump', () => {
    it('should set velocity_y to jump_strength when jumping', () => {
      character.jump();
      expect(character.velocity_y).toBe(character.jump_strength);
    });

    it('should allow multiple jumps', () => {
      character.jump();
      const firstJumpVelocity = character.velocity_y;
      
      character.jump();
      expect(character.velocity_y).toBe(firstJumpVelocity);
    });
  });

  describe('update', () => {
    it('should apply gravity to velocity', () => {
      const initialVelocity = character.velocity_y;
      character.update();
      expect(character.velocity_y).toBe(initialVelocity + character.gravity);
    });

    it('should update position based on velocity', () => {
      const initialY = character.y;
      character.velocity_y = 5;
      character.update();
      expect(character.y).toBe(initialY + 5);
    });

    it('should handle negative velocity (upward movement)', () => {
      const initialY = character.y;
      character.velocity_y = -5;
      character.update();
      expect(character.y).toBe(initialY - 5);
    });

    it('should apply gravity multiple times correctly', () => {
      const initialVelocity = character.velocity_y;
      character.update();
      character.update();
      expect(character.velocity_y).toBe(initialVelocity + 2 * character.gravity);
    });
  });

  describe('physics simulation', () => {
    it('should simulate realistic falling motion', () => {
      const initialY = character.y;
      character.velocity_y = 0;

      // Simulate several frames of falling
      for (let i = 0; i < 10; i++) {
        character.update();
      }

      expect(character.y).toBeGreaterThan(initialY);
      expect(character.velocity_y).toBeGreaterThan(0);
    });

    it('should simulate jump and fall cycle', () => {
      const initialY = character.y;
      
      // Jump
      character.jump();
      expect(character.velocity_y).toBe(-10);
      
      // Character should go up first
      character.update();
      expect(character.y).toBeLessThan(initialY);
      
      // After many updates, character should fall below initial position
      for (let i = 0; i < 50; i++) {
        character.update();
      }
      
      expect(character.y).toBeGreaterThan(initialY);
      expect(character.velocity_y).toBeGreaterThan(0);
    });
  });

  describe('reset', () => {
    it('should reset position to canvas center', () => {
      const canvasHeight = 600;
      character.y = 100;
      character.velocity_y = 5;
      
      character.reset(canvasHeight);
      
      expect(character.y).toBe(canvasHeight / 2);
      expect(character.velocity_y).toBe(0);
    });

    it('should handle different canvas heights', () => {
      const canvasHeight = 800;
      character.reset(canvasHeight);
      expect(character.y).toBe(400);
    });
  });

  describe('getBounds', () => {
    it('should return correct bounds', () => {
      character.x = 150;
      character.y = 300;
      
      const bounds = character.getBounds();
      
      expect(bounds.left).toBe(150 - 30); // x - size/2
      expect(bounds.right).toBe(150 + 30); // x + size/2
      expect(bounds.top).toBe(300 - 30); // y - size/2
      expect(bounds.bottom).toBe(300 + 30); // y + size/2
    });

    it('should update bounds when position changes', () => {
      character.x = 100;
      character.y = 200;
      
      const bounds1 = character.getBounds();
      
      character.x = 200;
      character.y = 400;
      
      const bounds2 = character.getBounds();
      
      expect(bounds2.left).toBe(bounds1.left + 100);
      expect(bounds2.right).toBe(bounds1.right + 100);
      expect(bounds2.top).toBe(bounds1.top + 200);
      expect(bounds2.bottom).toBe(bounds1.bottom + 200);
    });
  });

  describe('draw', () => {
    let mockCtx: any;
    let mockImage: any;

    beforeEach(() => {
      mockCtx = {
        save: vi.fn(),
        restore: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
        drawImage: vi.fn(),
      };
      
      mockImage = new Image();
    });

    it('should not draw when image is not provided', () => {
      character.draw(mockCtx, null as any);
      expect(mockCtx.drawImage).not.toHaveBeenCalled();
    });

    it('should save and restore context', () => {
      character.draw(mockCtx, mockImage);
      expect(mockCtx.save).toHaveBeenCalled();
      expect(mockCtx.restore).toHaveBeenCalled();
    });

    it('should translate to character position', () => {
      character.x = 150;
      character.y = 300;
      character.draw(mockCtx, mockImage);
      expect(mockCtx.translate).toHaveBeenCalledWith(150, 300);
    });

    it('should rotate based on velocity', () => {
      character.velocity_y = 10;
      character.draw(mockCtx, mockImage);
      expect(mockCtx.rotate).toHaveBeenCalled();
      
      // Check that rotation was called with a reasonable angle
      const rotateCall = mockCtx.rotate.mock.calls[0];
      expect(rotateCall[0]).toBeTypeOf('number');
    });

    it('should draw image with correct dimensions', () => {
      character.draw(mockCtx, mockImage);
      expect(mockCtx.drawImage).toHaveBeenCalledWith(
        mockImage,
        -character.size / 2,
        -character.size / 2,
        character.size,
        character.size
      );
    });
  });

  describe('edge cases', () => {
    it('should handle very large velocities', () => {
      character.velocity_y = 1000;
      const initialY = character.y;
      character.update();
      expect(character.y).toBe(initialY + 1000 + character.gravity);
    });

    it('should handle negative positions', () => {
      character.y = -100;
      character.velocity_y = 5;
      character.update();
      expect(character.y).toBe(-100 + 5 + character.gravity);
    });

    it('should maintain x position during updates', () => {
      const initialX = character.x;
      for (let i = 0; i < 100; i++) {
        character.update();
      }
      expect(character.x).toBe(initialX);
    });
  });

  describe('performance', () => {
    it('should handle rapid updates efficiently', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 10000; i++) {
        character.update();
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete 10k updates in reasonable time (less than 100ms)
      expect(duration).toBeLessThan(100);
    });
  });
});
