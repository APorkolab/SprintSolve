import { describe, it, expect } from 'vitest';
import * as utils from './src/utils';

describe('Debug imports', () => {
  it('should show what is imported', () => {
    console.log('Available exports:', Object.keys(utils));
    console.log('clamp function:', typeof utils.clamp);
    console.log('wrapText function:', typeof utils.wrapText);
    
    // This will always pass, but let's see the logs
    expect(true).toBe(true);
  });
});
