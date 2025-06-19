import React, { useState, useEffect } from 'react';
import { Smartphone, Volume2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { SpeechUtils } from '../utils/speechUtils';

interface WeChatGuideProps {
  onClose: () => void;
}

const WeChatGuide: React.FC<WeChatGuideProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [envInfo, setEnvInfo] = useState(SpeechUtils.getEnvironmentInfo());
  const [testResult, setTestResult] = useState<'none' | 'success' | 'failed'>('none');

  useEffect(() => {
    const interval = setInterval(() => {
      setEnvInfo(SpeechUtils.getEnvironmentInfo());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [testMessage, setTestMessage] = useState<string>('');

  const handleTestSpeech = async () => {
    setTestResult('none');
    setTestMessage('正在测试语音功能...');

    try {
      console.log('开始智能语音测试...');

      const result = await SpeechUtils.testSpeech('Hello, this is a test!');

      console.log('语音测试结果:', result);

      setTestResult(result.success ? 'success' : 'failed');
      setTestMessage(result.message + (result.details ? ` - ${result.details}` : ''));

    } catch (error) {
      console.error('语音测试异常:', error);
      setTestResult('failed');
      setTestMessage('测试过程中发生异常');
    }
  };

  const steps = [
    {
      title: '第一步：激活语音功能',
      description: '在微信浏览器中，需要先与页面交互才能使用语音功能',
      action: '请点击下方按钮激活',
      completed: envInfo.userInteracted
    },
    {
      title: '第二步：测试语音播放',
      description: '测试语音功能是否正常工作',
      action: '点击测试按钮',
      completed: testResult === 'success'
    },
    {
      title: '第三步：开始学习',
      description: '现在可以正常使用所有语音功能了！',
      action: '开始你的英语学习之旅',
      completed: testResult === 'success'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-700 shadow-2xl">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">微信浏览器语音设置</h3>
              <p className="text-sm text-gray-400">让语音功能正常工作</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* 环境信息 */}
        <div className="bg-slate-700/50 rounded-lg p-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">微信浏览器:</span>
            <span className={envInfo.isWeChat ? 'text-green-400' : 'text-red-400'}>
              {envInfo.isWeChat ? '✓ 已检测' : '✗ 未检测'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-300">语音支持:</span>
            <span className={envInfo.speechSupported ? 'text-green-400' : 'text-red-400'}>
              {envInfo.speechSupported ? '✓ 支持' : '✗ 不支持'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-300">用户交互:</span>
            <span className={envInfo.userInteracted ? 'text-green-400' : 'text-yellow-400'}>
              {envInfo.userInteracted ? '✓ 已激活' : '⚠ 待激活'}
            </span>
          </div>
        </div>

        {/* 步骤指南 */}
        <div className="space-y-4">
          {steps.map((stepInfo, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 transition-all duration-300 ${
                stepInfo.completed
                  ? 'border-green-500/50 bg-green-500/10'
                  : step === index + 1
                  ? 'border-blue-500/50 bg-blue-500/10'
                  : 'border-slate-600 bg-slate-700/30'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  stepInfo.completed
                    ? 'bg-green-500'
                    : step === index + 1
                    ? 'bg-blue-500'
                    : 'bg-slate-600'
                }`}>
                  {stepInfo.completed ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{stepInfo.title}</h4>
                  <p className="text-sm text-gray-300 mb-3">{stepInfo.description}</p>
                  
                  {/* 操作按钮 */}
                  {index === 0 && !stepInfo.completed && (
                    <button
                      onClick={() => {
                        // 触发用户交互
                        document.dispatchEvent(new Event('click'));
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      激活语音功能
                    </button>
                  )}
                  
                  {index === 1 && envInfo.userInteracted && testResult !== 'success' && (
                    <button
                      onClick={handleTestSpeech}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>测试语音播放</span>
                    </button>
                  )}
                  
                  {index === 2 && stepInfo.completed && (
                    <button
                      onClick={onClose}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      <span>开始学习</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 测试结果 */}
        {testResult !== 'none' && (
          <div className={`mt-4 p-3 rounded-lg ${
            testResult === 'success'
              ? 'bg-green-500/20 border border-green-500/50'
              : 'bg-yellow-500/20 border border-yellow-500/50'
          }`}>
            <div className="flex items-start space-x-2">
              {testResult === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  testResult === 'success' ? 'text-green-300' : 'text-yellow-300'
                }`}>
                  {testResult === 'success' ? '✅ 语音测试完成' : '⚠️ 语音测试信息'}
                </p>
                <p className={`text-xs mt-1 ${
                  testResult === 'success' ? 'text-green-200' : 'text-yellow-200'
                }`}>
                  {testMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 底部提示 */}
        <div className="mt-6 p-3 bg-slate-700/30 rounded-lg">
          <p className="text-xs text-gray-400 text-center">
            💡 提示：如果语音仍无法播放，请检查手机是否开启静音模式，或尝试重新进入页面。
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeChatGuide;
