import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, CheckCircle, XCircle, Volume2, Settings } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface SpeechTroubleshooterProps {
  onClose: () => void;
  error?: string;
}

const SpeechTroubleshooter: React.FC<SpeechTroubleshooterProps> = ({ onClose, error }) => {
  const [isResetting, setIsResetting] = useState(false);
  const [resetResult, setResetResult] = useState<'none' | 'success' | 'failed'>('none');
  const [testResult, setTestResult] = useState<'none' | 'testing' | 'success' | 'failed'>('none');
  const { reset, speak, getEnvironmentInfo } = useSpeech();

  const handleReset = async () => {
    setIsResetting(true);
    setResetResult('none');
    
    try {
      await reset();
      setResetResult('success');
      
      // 重置后自动测试
      setTimeout(() => {
        handleTest();
      }, 500);
      
    } catch (error) {
      console.error('重置失败:', error);
      setResetResult('failed');
    } finally {
      setIsResetting(false);
    }
  };

  const handleTest = async () => {
    setTestResult('testing');
    
    try {
      const success = await speak('Hello, this is a test after reset.', {
        lang: 'en-US',
        rate: 0.7,
        volume: 0.8,
        showAlert: false
      });
      
      setTestResult(success ? 'success' : 'failed');
    } catch (error) {
      console.error('测试失败:', error);
      setTestResult('failed');
    }
  };

  const envInfo = getEnvironmentInfo();

  const troubleshootingSteps = [
    {
      title: '1. 重置语音引擎',
      description: '清除语音合成器的缓存和状态',
      action: handleReset,
      buttonText: isResetting ? '重置中...' : '重置语音引擎',
      disabled: isResetting,
      status: resetResult
    },
    {
      title: '2. 检查浏览器设置',
      description: '确保浏览器允许音频播放',
      action: () => {
        alert('请检查浏览器设置：\n1. 确保网站允许播放音频\n2. 检查浏览器音量设置\n3. 尝试刷新页面');
      },
      buttonText: '查看设置指南',
      disabled: false,
      status: 'none'
    },
    {
      title: '3. 测试语音播放',
      description: '验证语音功能是否恢复正常',
      action: handleTest,
      buttonText: testResult === 'testing' ? '测试中...' : '测试语音',
      disabled: testResult === 'testing',
      status: testResult === 'testing' ? 'none' : testResult
    }
  ];

  const getErrorSolution = (errorType: string) => {
    switch (errorType) {
      case 'synthesis-failed':
        return {
          title: 'synthesis-failed 错误',
          description: '语音合成引擎失败，通常是由于引擎状态异常或参数冲突',
          solutions: [
            '重置语音引擎可以解决大部分问题',
            '降低播放速度和音量',
            '确保没有其他应用占用音频设备',
            '尝试刷新页面重新初始化'
          ]
        };
      case 'audio-busy':
        return {
          title: 'audio-busy 错误',
          description: '音频设备被其他应用占用',
          solutions: [
            '关闭其他正在播放音频的应用',
            '检查是否有其他网页在播放音频',
            '重启浏览器',
            '检查系统音频设置'
          ]
        };
      case 'network':
        return {
          title: 'network 错误',
          description: '网络连接问题导致语音合成失败',
          solutions: [
            '检查网络连接',
            '尝试刷新页面',
            '切换到其他网络',
            '稍后重试'
          ]
        };
      default:
        return {
          title: '未知错误',
          description: '遇到了未知的语音播放错误',
          solutions: [
            '尝试重置语音引擎',
            '刷新页面重新加载',
            '检查浏览器兼容性',
            '联系技术支持'
          ]
        };
    }
  };

  const errorInfo = error ? getErrorSolution(error) : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-lg w-full border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">语音故障排除</h3>
              <p className="text-sm text-gray-400">解决语音播放问题</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* 错误信息 */}
        {errorInfo && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-red-300 mb-2">{errorInfo.title}</h4>
            <p className="text-red-200 text-sm mb-3">{errorInfo.description}</p>
            <div className="space-y-1">
              <p className="text-red-200 text-sm font-medium">解决方案：</p>
              {errorInfo.solutions.map((solution, index) => (
                <p key={index} className="text-red-100 text-xs">• {solution}</p>
              ))}
            </div>
          </div>
        )}

        {/* 环境信息 */}
        <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-white mb-3">当前环境</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">浏览器:</span>
              <span className="text-white">{envInfo.isWeChat ? '微信' : '标准'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">设备:</span>
              <span className="text-white">{envInfo.isMobile ? '移动端' : '桌面端'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">语音支持:</span>
              <span className={envInfo.speechSupported ? 'text-green-400' : 'text-red-400'}>
                {envInfo.speechSupported ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">用户交互:</span>
              <span className={envInfo.userInteracted ? 'text-green-400' : 'text-yellow-400'}>
                {envInfo.userInteracted ? '✓' : '⚠'}
              </span>
            </div>
          </div>
        </div>

        {/* 故障排除步骤 */}
        <div className="space-y-4">
          <h4 className="font-medium text-white">故障排除步骤</h4>
          {troubleshootingSteps.map((step, index) => (
            <div
              key={index}
              className="border border-slate-600 rounded-lg p-4 bg-slate-700/30"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h5 className="font-medium text-white mb-1">{step.title}</h5>
                  <p className="text-sm text-gray-300">{step.description}</p>
                </div>
                <div className="ml-3">
                  {step.status === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
                  {step.status === 'failed' && <XCircle className="w-5 h-5 text-red-400" />}
                  {step.status === 'none' && <div className="w-5 h-5" />}
                </div>
              </div>
              <button
                onClick={step.action}
                disabled={step.disabled}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  step.disabled
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {step.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
          <p className="text-blue-300 text-sm text-center">
            💡 如果问题仍然存在，请尝试刷新页面或重启浏览器
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpeechTroubleshooter;
