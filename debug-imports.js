// Simple debug script to test imports
import * as utils from './src/utils.ts';

console.log('Available exports:', Object.keys(utils));
console.log('clamp function:', typeof utils.clamp);
console.log('wrapText function:', typeof utils.wrapText);

// Test a specific function
if (utils.clamp) {
  console.log('clamp(5, 0, 10):', utils.clamp(5, 0, 10));
} else {
  console.log('clamp is not available');
}
