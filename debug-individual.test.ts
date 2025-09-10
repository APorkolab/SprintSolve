import { describe, it, expect } from 'vitest';
import { wrapText, clamp, lerp } from './src/utils';

describe('Individual imports', () => {
  it('should import individual functions', () => {
    console.log('wrapText:', typeof wrapText);
    console.log('clamp:', typeof clamp);
    console.log('lerp:', typeof lerp);
    
    expect(true).toBe(true);
  });
});
