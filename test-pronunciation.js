// 测试发音修正功能
import { PronunciationCorrector } from './src/utils/pronunciationCorrector.js';

// 测试用例
const testCases = [
    'in the evening',
    'in the morning', 
    'the evening',
    'the apple',
    'the orange',
    'in the afternoon',
    'the elephant',
    'the umbrella'
];

console.log('🎵 测试发音修正功能\n');

testCases.forEach(text => {
    const corrected = PronunciationCorrector.quickCorrect(text);
    const needsCorrection = PronunciationCorrector.needsCorrection(text);
    const corrections = PronunciationCorrector.previewCorrections(text);
    
    console.log(`原文: "${text}"`);
    console.log(`修正后: "${corrected}"`);
    console.log(`需要修正: ${needsCorrection}`);
    console.log(`修正详情:`, corrections);
    console.log('---');
});
