import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  wrapText,
  clamp,
  lerp,
  mapRange,
  randomBetween,
  randomIntBetween,
  rectIntersect,
  distance,
  degreesToRadians,
  radiansToDegrees,
  formatTime,
  debounce,
  throttle,
  deepClone,
  delay,
  safeJsonParse,
} from '../../src/utils';

describe('Utils', () => {
  describe('wrapText', () => {
    let mockCtx: any;

    beforeEach(() => {
      mockCtx = {
        measureText: vi.fn().mockReturnValue({ width: 50 }),
        fillText: vi.fn(),
      };
    });

    it('should render single line text', () => {
      wrapText(mockCtx, 'Hello', 100, 100, 200, 20);
      expect(mockCtx.fillText).toHaveBeenCalledWith('Hello', 100, 100);
    });

    it('should wrap long text into multiple lines', () => {
      mockCtx.measureText.mockImplementation((text: string) => {
        if (text.includes('very long')) return { width: 250 };
        return { width: 50 };
      });

      wrapText(mockCtx, 'This is a very long text that should wrap', 100, 100, 200, 20);
      
      expect(mockCtx.fillText).toHaveBeenCalledTimes(2);
    });

    it('should handle empty text', () => {
      wrapText(mockCtx, '', 100, 100, 200, 20);
      expect(mockCtx.fillText).toHaveBeenCalledWith('', 100, 100);
    });

    it('should center text vertically', () => {
      mockCtx.measureText.mockReturnValue({ width: 250 });
      
      wrapText(mockCtx, 'Line 1 Line 2', 100, 100, 100, 20);
      
      // Should adjust Y position for centering
      const calls = mockCtx.fillText.mock.calls;
      expect(calls[0][2]).toBeLessThan(100); // First line should be above center
    });
  });

  describe('clamp', () => {
    it('should return value when within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it('should return min when value is below range', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('should return max when value is above range', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('should handle edge cases', () => {
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });

    it('should work with negative numbers', () => {
      expect(clamp(-15, -10, -5)).toBe(-10);
      expect(clamp(-3, -10, -5)).toBe(-5);
    });
  });

  describe('lerp', () => {
    it('should interpolate between two values', () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
    });

    it('should return start value when factor is 0', () => {
      expect(lerp(10, 20, 0)).toBe(10);
    });

    it('should return end value when factor is 1', () => {
      expect(lerp(10, 20, 1)).toBe(20);
    });

    it('should work with negative values', () => {
      expect(lerp(-10, 10, 0.5)).toBe(0);
    });

    it('should extrapolate with factors outside 0-1', () => {
      expect(lerp(0, 10, 2)).toBe(20);
      expect(lerp(0, 10, -0.5)).toBe(-5);
    });
  });

  describe('mapRange', () => {
    it('should map value from one range to another', () => {
      expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
    });

    it('should handle different ranges', () => {
      expect(mapRange(2, 1, 3, 10, 20)).toBe(15);
    });

    it('should work with negative values', () => {
      expect(mapRange(-5, -10, 0, 0, 100)).toBe(50);
    });
  });

  describe('randomBetween', () => {
    it('should return value within range', () => {
      const result = randomBetween(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });

    it('should return different values on multiple calls', () => {
      const results = Array.from({ length: 10 }, () => randomBetween(0, 1));
      const unique = new Set(results);
      expect(unique.size).toBeGreaterThan(1); // Should have some variation
    });
  });

  describe('randomIntBetween', () => {
    it('should return integer within range', () => {
      const result = randomIntBetween(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should include both bounds', () => {
      const results = Array.from({ length: 1000 }, () => randomIntBetween(1, 3));
      expect(results).toContain(1);
      expect(results).toContain(3);
    });
  });

  describe('rectIntersect', () => {
    it('should detect intersection', () => {
      const rect1 = { x: 0, y: 0, width: 10, height: 10 };
      const rect2 = { x: 5, y: 5, width: 10, height: 10 };
      expect(rectIntersect(rect1, rect2)).toBe(true);
    });

    it('should detect no intersection', () => {
      const rect1 = { x: 0, y: 0, width: 5, height: 5 };
      const rect2 = { x: 10, y: 10, width: 5, height: 5 };
      expect(rectIntersect(rect1, rect2)).toBe(false);
    });

    it('should handle touching rectangles', () => {
      const rect1 = { x: 0, y: 0, width: 5, height: 5 };
      const rect2 = { x: 5, y: 0, width: 5, height: 5 };
      expect(rectIntersect(rect1, rect2)).toBe(false); // Just touching, not intersecting
    });

    it('should handle contained rectangles', () => {
      const rect1 = { x: 0, y: 0, width: 10, height: 10 };
      const rect2 = { x: 2, y: 2, width: 2, height: 2 };
      expect(rectIntersect(rect1, rect2)).toBe(true);
    });
  });

  describe('distance', () => {
    it('should calculate distance between two points', () => {
      expect(distance(0, 0, 3, 4)).toBe(5); // 3-4-5 triangle
    });

    it('should handle same point', () => {
      expect(distance(5, 5, 5, 5)).toBe(0);
    });

    it('should handle negative coordinates', () => {
      expect(distance(-3, -4, 0, 0)).toBe(5);
    });
  });

  describe('degreesToRadians', () => {
    it('should convert degrees to radians', () => {
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI);
      expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2);
      expect(degreesToRadians(0)).toBe(0);
    });
  });

  describe('radiansToDegrees', () => {
    it('should convert radians to degrees', () => {
      expect(radiansToDegrees(Math.PI)).toBeCloseTo(180);
      expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90);
      expect(radiansToDegrees(0)).toBe(0);
    });
  });

  describe('formatTime', () => {
    it('should format seconds into MM:SS', () => {
      expect(formatTime(0)).toBe('00:00');
      expect(formatTime(59)).toBe('00:59');
      expect(formatTime(60)).toBe('01:00');
      expect(formatTime(125)).toBe('02:05');
    });

    it('should handle large values', () => {
      expect(formatTime(3661)).toBe('61:01'); // Over an hour
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should delay function execution', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledOnce();
    });

    it('should cancel previous calls', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledOnce();
    });

    it('should pass arguments correctly', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn('arg1', 'arg2');
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should limit function calls', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(fn).toHaveBeenCalledOnce();

      vi.advanceTimersByTime(100);
      throttledFn();

      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('deepClone', () => {
    it('should clone primitive values', () => {
      expect(deepClone(5)).toBe(5);
      expect(deepClone('hello')).toBe('hello');
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
    });

    it('should clone arrays', () => {
      const arr = [1, 2, [3, 4]];
      const cloned = deepClone(arr);

      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[2]).not.toBe(arr[2]);
    });

    it('should clone objects', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = deepClone(obj);

      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });

    it('should clone dates', () => {
      const date = new Date('2024-01-01');
      const cloned = deepClone(date);

      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
    });
  });

  describe('delay', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should resolve after specified delay', async () => {
      const promise = delay(100);
      let resolved = false;

      promise.then(() => {
        resolved = true;
      });

      expect(resolved).toBe(false);
      vi.advanceTimersByTime(100);
      
      await promise;
      expect(resolved).toBe(true);
    });
  });

  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      const result = safeJsonParse('{"a": 1}', null);
      expect(result).toEqual({ a: 1 });
    });

    it('should return fallback for invalid JSON', () => {
      const result = safeJsonParse('invalid json', { default: true });
      expect(result).toEqual({ default: true });
    });

    it('should handle null fallback', () => {
      const result = safeJsonParse('invalid', null);
      expect(result).toBe(null);
    });

    it('should parse arrays', () => {
      const result = safeJsonParse('[1, 2, 3]', []);
      expect(result).toEqual([1, 2, 3]);
    });
  });
});
