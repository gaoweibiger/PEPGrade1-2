import React, { useState } from 'react';
import { Volume2, CheckCircle, AlertCircle } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import { SpeechUtils } from '../utils/speechUtils';

const PronunciationTest: React.FC = () => {
  const { speak } = useSpeech();
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  const testCases = [
    { text: 'in the evening', expected: 'in the, evening' },
    { text: 'in the morning', expected: 'in the, morning' },
    { text: 'the evening', expected: 'the, evening' },
    { text: 'the apple', expected: 'the, apple' },
    { text: 'in the afternoon', expected: 'in the, afternoon' },
    { text: 'My teeth are clean', expected: 'My teeth, are clean' },
    { text: 'teeth are', expected: 'teeth, are' },
    { text: 'hands are', expected: 'hands, are' },
  ];

  const runTest = async (testCase: { text: string; expected: string }) => {
    try {
      // 获取修正预览
      const preview = SpeechUtils.previewPronunciationCorrection(testCase.text);
      
      // 播放修正后的语音
      const success = await speak(testCase.text, {
        enablePronunciationCorrection: true,
        showCorrectionInfo: true
      });

      // 更新测试结果
      setTestResults(prev => ({
        ...prev,
        [testCase.text]: {
          original: testCase.text,
          corrected: preview.corrected,
          expected: testCase.expected,
          corrections: preview.corrections,
          needsCorrection: preview.needsCorrection,
          success
        }
      }));

      console.log(`测试: "${testCase.text}"`);
      console.log(`原文: "${preview.original}"`);
      console.log(`修正后: "${preview.corrected}"`);
      console.log(`期望: "${testCase.expected}"`);
      console.log(`匹配: ${preview.corrected === testCase.expected}`);
      console.log('修正详情:', preview.corrections);
      console.log('---');

    } catch (error) {
      console.error('测试失败:', error);
      setTestResults(prev => ({
        ...prev,
        [testCase.text]: {
          error: error instanceof Error ? error.message : '未知错误'
        }
      }));
    }
  };

  const runAllTests = async () => {
    console.log('🎵 开始运行发音修正测试...\n');
    for (const testCase of testCases) {
      await runTest(testCase);
      // 等待一下再进行下一个测试
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('✅ 所有测试完成！');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        🎵 发音修正功能测试
      </h2>
      
      <div className="mb-6 text-center">
        <button
          onClick={runAllTests}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          运行所有测试
        </button>
      </div>

      <div className="grid gap-4">
        {testCases.map((testCase, index) => {
          const result = testResults[testCase.text];
          
          return (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">
                    原文: "{testCase.text}"
                  </div>
                  <div className="text-sm text-gray-600">
                    期望: "{testCase.expected}"
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => runTest(testCase)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                  >
                    <Volume2 size={16} />
                    测试
                  </button>
                </div>
              </div>

              {result && (
                <div className="mt-3 p-3 bg-white rounded border">
                  {result.error ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle size={16} />
                      <span>错误: {result.error}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {result.corrected === testCase.expected ? (
                          <CheckCircle size={16} className="text-green-600" />
                        ) : (
                          <AlertCircle size={16} className="text-orange-600" />
                        )}
                        <span className="font-medium">
                          修正后: "{result.corrected}"
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        需要修正: {result.needsCorrection ? '是' : '否'}
                      </div>
                      
                      {result.corrections && result.corrections.length > 0 && (
                        <div className="text-sm">
                          <div className="font-medium text-gray-700 mb-1">应用的修正:</div>
                          {result.corrections.map((correction: any, idx: number) => (
                            <div key={idx} className="text-gray-600 ml-2">
                              • {correction.type}: "{correction.original}" → "{correction.corrected}"
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-600">
                        播放状态: {result.success ? '成功' : '失败'}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">测试说明:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 点击"测试"按钮测试单个短语的发音修正</li>
          <li>• 点击"运行所有测试"按钮批量测试所有短语</li>
          <li>• 绿色勾号表示修正结果符合预期</li>
          <li>• 橙色感叹号表示修正结果与预期不符</li>
          <li>• 查看控制台获取详细的测试日志</li>
        </ul>
      </div>
    </div>
  );
};

export default PronunciationTest;
