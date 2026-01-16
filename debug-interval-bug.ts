/**
 * Debug script to understand the interval calculation bug
 */

import { getBaseInterval, getDifficultyMultiplier } from './utils';

console.log('🔍 Debugging Interval Calculation Bug\n');

// Session 6 state
console.log('Session 6 (before):');
console.log('  Cumulative: 21 correct / 39 incorrect');
console.log('  Accuracy: 35%');
console.log('  Review Count: 1');
console.log('  Base Interval:', getBaseInterval(1), 'days');
console.log('  Difficulty Multiplier:', getDifficultyMultiplier(0.35).toFixed(2));
console.log('  Final Interval:', Math.max(1, Math.round(getBaseInterval(1) * getDifficultyMultiplier(0.35))), 'days');

console.log('\nSession 7 (after):');
console.log('  New data: 7 correct / 3 incorrect');
console.log('  Cumulative: 28 correct / 42 incorrect');
console.log('  New Accuracy: 40%');
console.log('  Should increment? Yes (accuracy >= 40%)');
console.log('  New Review Count: 2');
console.log('  Base Interval:', getBaseInterval(2), 'days');
console.log('  Difficulty Multiplier:', getDifficultyMultiplier(0.40).toFixed(2));
console.log('  Final Interval:', Math.max(1, Math.round(getBaseInterval(2) * getDifficultyMultiplier(0.40))), 'days');

console.log('\n🔍 The bug is clear:');
console.log('  Base interval increased from 1 to 2 days');
console.log('  But difficulty multiplier (0.69) brings it down:');
console.log('  2 * 0.69 = 1.38, rounded to 1 day');
console.log('  This is technically correct behavior, but counterintuitive.');
