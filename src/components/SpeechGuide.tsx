import React, { useState } from 'react';
import { Volume2, Smartphone, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import EnhancedSpeechButton from './EnhancedSpeechButton';

interface SpeechGuideProps {
  onClose: () => void;
}

const SpeechGuide: React.FC<SpeechGuideProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { getEnvironmentInfo } = useSpeech();
  const envInfo = getEnvironmentInfo();

  const steps = [
    {
      title: '🎵 语音功能介绍',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            我们的英语学习应用配备了先进的语音播放功能，帮助你正确学习英语发音。
          </p>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">✨ 主要特色：</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• 🎯 专门优化的微信浏览器支持</li>
              <li>• 🔄 智能重试机制</li>
              <li>• 📱 移动端友好的交互设计</li>
              <li>• 🎨 直观的状态指示器</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: '📱 环境检测',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">让我们检查一下你的设备环境：</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
              <span className="text-gray-300">浏览器类型:</span>
              <span className={envInfo.isWeChat ? 'text-green-400' : 'text-blue-400'}>
                {envInfo.isWeChat ? '🔥 微信浏览器' : '🌐 标准浏览器'}
              </span>
            </div>
            <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
              <span className="text-gray-300">语音支持:</span>
              <span className={
                envInfo.supportLevel === 'full' ? 'text-green-400' :
                envInfo.supportLevel === 'limited' ? 'text-yellow-400' : 'text-red-400'
              }>
                {envInfo.supportLevel === 'full' ? '✅ 完全支持' :
                 envInfo.supportLevel === 'limited' ? '⚠️ 有限支持' : '❌ 不支持'}
              </span>
            </div>
            <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
              <span className="text-gray-300">交互状态:</span>
              <span className={envInfo.userInteracted ? 'text-green-400' : 'text-yellow-400'}>
                {envInfo.userInteracted ? '✅ 已激活' : '⚠️ 需要激活'}
              </span>
            </div>
            {envInfo.isWeChat && (
              <>
                <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                  <span className="text-gray-300">微信版本:</span>
                  <span className={envInfo.wechatVersionSupported ? 'text-green-400' : 'text-red-400'}>
                    {envInfo.wechatVersion || '未知'}
                  </span>
                </div>
                {envInfo.isWechatMiniProgram && (
                  <div className="flex items-center justify-between bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                    <span className="text-red-300">⚠️ 小程序环境:</span>
                    <span className="text-red-400">不支持语音</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )
    },
    {
      title: '🚀 语音按钮使用',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">语音按钮有多种状态，让你清楚了解播放进度：</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <EnhancedSpeechButton text="Hello" size="md" variant="primary" />
              <p className="text-xs text-gray-400 mt-2">待机状态</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Volume2 className="w-6 h-6 text-white animate-pulse" />
              </div>
              <p className="text-xs text-gray-400 mt-2">播放中</p>
            </div>
          </div>
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-300 text-sm font-medium">💡 使用技巧</p>
                <p className="text-blue-200 text-xs mt-1">
                  点击语音按钮后，按钮会显示加载、播放、成功等不同状态，让你清楚了解播放进度。
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '🔧 微信浏览器特别说明',
      content: (
        <div className="space-y-4">
          {envInfo.isWeChat ? (
            <>
              <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Smartphone className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-orange-300 text-sm font-medium">微信浏览器用户</p>
                    <p className="text-orange-200 text-xs mt-1">
                      由于微信浏览器的安全限制，需要先与页面交互才能播放语音。
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-white">📋 使用步骤：</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                    <span className="text-gray-300">点击页面任意位置激活语音功能</span>
                    {envInfo.userInteracted && <CheckCircle className="w-4 h-4 text-green-400" />}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                    <span className="text-gray-300">点击语音按钮播放英语发音</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                    <span className="text-gray-300">享受流畅的语音学习体验</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-300 text-sm font-medium">标准浏览器用户</p>
                  <p className="text-green-200 text-xs mt-1">
                    你的浏览器完全支持语音功能，可以直接点击语音按钮播放英语发音！
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: '🎯 实际体验',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">现在来试试语音功能吧！</p>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">🗣️ 试试这些单词：</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between bg-slate-600/50 rounded-lg p-3">
                <span className="text-white">Hello</span>
                <EnhancedSpeechButton 
                  text="Hello" 
                  size="sm" 
                  variant="primary"
                  showStatus={true}
                />
              </div>
              <div className="flex items-center justify-between bg-slate-600/50 rounded-lg p-3">
                <span className="text-white">Welcome</span>
                <EnhancedSpeechButton 
                  text="Welcome" 
                  size="sm" 
                  variant="primary"
                  showStatus={true}
                />
              </div>
              <div className="flex items-center justify-between bg-slate-600/50 rounded-lg p-3">
                <span className="text-white">Thank you</span>
                <EnhancedSpeechButton 
                  text="Thank you" 
                  size="sm" 
                  variant="primary"
                  showStatus={true}
                />
              </div>
              <div className="flex items-center justify-between bg-slate-600/50 rounded-lg p-3">
                <span className="text-white">Good morning</span>
                <EnhancedSpeechButton 
                  text="Good morning" 
                  size="sm" 
                  variant="primary"
                  showStatus={true}
                />
              </div>
            </div>
          </div>
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
            <p className="text-green-300 text-sm text-center">
              🎉 太棒了！现在你可以开始你的英语学习之旅了！
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-lg w-full border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">语音功能指南</h3>
              <p className="text-sm text-gray-400">让语音学习更简单</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 进度指示器 */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep
                  ? 'bg-purple-500'
                  : index < currentStep
                  ? 'bg-green-500'
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* 内容区域 */}
        <div className="mb-6">
          <h4 className="text-xl font-bold text-white mb-4">{steps[currentStep].title}</h4>
          {steps[currentStep].content}
        </div>

        {/* 导航按钮 */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 disabled:text-gray-500 text-white rounded-lg transition-colors"
          >
            上一步
          </button>
          
          <span className="text-gray-400 text-sm">
            {currentStep + 1} / {steps.length}
          </span>
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
            >
              下一步
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
            >
              开始学习
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeechGuide;
