import { describe, it, expect } from 'vitest';
import { wrapText, clamp, lerp } from './test-utils';

describe('Minimal utils test', () => {
  it('should import all functions', () => {
    console.log('wrapText:', typeof wrapText);
    console.log('clamp:', typeof clamp);
    console.log('lerp:', typeof lerp);
    
    expect(typeof wrapText).toBe('function');
    expect(typeof clamp).toBe('function');
    expect(typeof lerp).toBe('function');
  });
});
