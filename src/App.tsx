import React, { useState, useEffect } from 'react';
import { BookOpen, Hash, MessageSquare, Shuffle, Smartphone } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import NavigationCard from './components/NavigationCard';
import UnitLearning from './components/UnitLearning';
import ChallengeMode from './components/ChallengeMode';
import WeChatGuide from './components/WeChatGuide';
import SpeechGuide from './components/SpeechGuide';
import SpeechCompatibilityAlert from './components/SpeechCompatibilityAlert';
import SpeechPerformanceMonitor from './components/SpeechPerformanceMonitor';
import PronunciationCorrectionDemo from './components/PronunciationCorrectionDemo';
import { SpeechUtils } from './utils/speechUtils';

type Section = 'home' | 'units' | 'words' | 'phrases' | 'sentences' | 'random';

function App() {
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [showWeChatTip, setShowWeChatTip] = useState(false);
  const [showWeChatGuide, setShowWeChatGuide] = useState(false);
  const [showSpeechGuide, setShowSpeechGuide] = useState(false);
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  const [showPronunciationDemo, setShowPronunciationDemo] = useState(false);

  useEffect(() => {
    const envInfo = SpeechUtils.getEnvironmentInfo();

    // 只在移动设备或微信浏览器中显示语音提示
    // PC端浏览器不显示微信相关提示
    if ((envInfo.isMobile || envInfo.isWeChat) && envInfo.isWeChat && !envInfo.userInteracted) {
      setShowWeChatTip(true);

      // 3秒后显示详细指南
      const guideTimer = setTimeout(() => {
        setShowWeChatGuide(true);
      }, 3000);

      // 8秒后自动隐藏简单提示
      const tipTimer = setTimeout(() => {
        setShowWeChatTip(false);
      }, 8000);

      return () => {
        clearTimeout(guideTimer);
        clearTimeout(tipTimer);
      };
    }
  }, []);

  const renderSection = () => {
    switch (currentSection) {
      case 'units':
        return <UnitLearning onBack={() => setCurrentSection('home')} />;
      case 'words':
        return <ChallengeMode mode="words" onBack={() => setCurrentSection('home')} />;
      case 'phrases':
        return <ChallengeMode mode="phrases" onBack={() => setCurrentSection('home')} />;
      case 'sentences':
        return <ChallengeMode mode="sentences" onBack={() => setCurrentSection('home')} />;
      case 'random':
        return <ChallengeMode mode="random" onBack={() => setCurrentSection('home')} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 relative overflow-hidden">
            {/* 移动端优化的动态背景粒子 */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 30 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-purple-400/30 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                />
              ))}
            </div>
            
            {/* 移动端优化的背景光效 */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[600px] sm:h-[600px] bg-gradient-to-r from-purple-600/5 to-blue-600/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }}></div>
            </div>
            
            <div className="relative z-10">
              <Header currentSection={currentSection} />

              {/* 微信浏览器语音提示 */}
              {showWeChatTip && (
                <div className="fixed top-20 left-4 right-4 z-50 animate-bounce">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl shadow-2xl border border-orange-300">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-6 h-6 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm">🎵 微信浏览器语音提示</h4>
                        <p className="text-xs mt-1">请先点击页面任意位置激活语音功能，然后就可以使用语音播放了！</p>
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => {
                              setShowWeChatGuide(true);
                              setShowWeChatTip(false);
                            }}
                            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                          >
                            微信设置
                          </button>
                          <button
                            onClick={() => {
                              setShowSpeechGuide(true);
                              setShowWeChatTip(false);
                            }}
                            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                          >
                            语音指南
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowWeChatTip(false)}
                        className="text-white/80 hover:text-white text-xl leading-none"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <main className="max-w-7xl mx-auto p-4 sm:p-8">
                {/* 移动端优化的介绍区域 */}
                <div className="text-center mb-8 sm:mb-12">
                  {/* 主标题 */}
                  <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 sm:mb-8 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg leading-tight">
                    开始你的英语学习之旅
                  </h2>
                  
                  {/* 移动端优化的信息卡片 */}
                  <div className="max-w-4xl mx-auto mb-6 sm:mb-8 px-2">
                    <div className="bg-gradient-to-r from-slate-800/50 via-slate-800/30 to-slate-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/40 shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        {/* 左侧图标 */}
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        
                        {/* 中间内容 */}
                        <div className="flex-1 text-center">
                          <h3 className="text-lg sm:text-2xl font-bold text-white mb-1">
                            系统化学习PEP一年级下册所有知识点
                          </h3>
                          <p className="text-base sm:text-lg text-purple-300">
                            选择学习模式，开始你的英语冒险！
                          </p>
                        </div>
                        
                        {/* 右侧装饰 */}
                        <div className="text-2xl sm:text-3xl animate-pulse">✨</div>
                      </div>
                      
                      {/* 底部学习类型指示器 */}
                      <div className="flex items-center justify-center space-x-4 sm:space-x-6 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-700/30">
                        <div className="flex items-center space-x-1 sm:space-x-2 text-gray-400">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-pulse"></div>
                          <span className="text-xs sm:text-sm">单词学习</span>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2 text-gray-400">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                          <span className="text-xs sm:text-sm">短语练习</span>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2 text-gray-400">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                          <span className="text-xs sm:text-sm">句子掌握</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 移动端优化的导航卡片网格 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-2 sm:px-0">
                  <NavigationCard
                    title="按单元学习"
                    description="系统学习每个单元的单词、短语和句子，循序渐进掌握知识点"
                    icon={BookOpen}
                    gradient="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-700"
                    onClick={() => setCurrentSection('units')}
                  />
                  
                  <NavigationCard
                    title="单词闯关"
                    description="挑战单词记忆，每关10道题，测试你的词汇掌握程度"
                    icon={Hash}
                    gradient="bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600"
                    onClick={() => setCurrentSection('words')}
                  />
                  
                  <NavigationCard
                    title="短语闯关"
                    description="练习常用短语，提升英语表达能力和语感"
                    icon={MessageSquare}
                    gradient="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600"
                    onClick={() => setCurrentSection('phrases')}
                  />
                  
                  <NavigationCard
                    title="句子闯关"
                    description="掌握完整句子表达，提高英语交流水平"
                    icon={MessageSquare}
                    gradient="bg-gradient-to-br from-orange-600 via-red-600 to-pink-600"
                    onClick={() => setCurrentSection('sentences')}
                  />
                </div>

                {/* 移动端优化的随机闯关按钮 */}
                <div className="mt-8 sm:mt-12 flex justify-center px-2 sm:px-0">
                  <div className="w-full sm:w-auto max-w-md sm:max-w-none">
                    <NavigationCard
                      title="随机闯关"
                      description="混合所有类型题目，全面测试你的英语水平，挑战你的极限！"
                      icon={Shuffle}
                      gradient="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600"
                      onClick={() => {
                        console.log('随机闯关按钮被点击'); // 调试日志
                        setCurrentSection('random');
                      }}
                    />
                  </div>
                </div>

                {/* 移动端优化的底部提示 */}
                <div className="text-center mt-12 sm:mt-16 px-4">
                  <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 inline-block border border-slate-700/50 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 max-w-md sm:max-w-none">
                    <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-2 sm:mb-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-lg sm:text-xl">🎯</span>
                      </div>
                      <p className="text-gray-300 text-lg sm:text-xl font-semibold">
                        每天坚持学习，英语水平稳步提升！
                      </p>
                    </div>
                    <p className="text-purple-400 font-bold text-base sm:text-lg bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
                      Practice makes perfect! 熟能生巧！
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={() => setShowSpeechGuide(true)}
                        className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-1 rounded-full transition-colors border border-purple-500/30"
                      >
                        🎵 语音功能使用指南
                      </button>
                      <button
                        onClick={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
                        className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1 rounded-full transition-colors border border-blue-500/30"
                      >
                        ⚡ 性能监控
                      </button>
                      <button
                        onClick={() => setShowPronunciationDemo(true)}
                        className="text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-1 rounded-full transition-colors border border-green-500/30"
                      >
                        📝 读音修正演示
                      </button>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        );
    }
  };

  return (
    <ErrorBoundary>
      {renderSection()}

      {/* 微信浏览器语音设置指南 */}
      {showWeChatGuide && (
        <WeChatGuide onClose={() => setShowWeChatGuide(false)} />
      )}

      {/* 语音功能使用指南 */}
      {showSpeechGuide && (
        <SpeechGuide onClose={() => setShowSpeechGuide(false)} />
      )}

      {/* 语音兼容性提示 */}
      <SpeechCompatibilityAlert />

      {/* 性能监控器 */}
      <SpeechPerformanceMonitor
        isVisible={showPerformanceMonitor}
        onClose={() => setShowPerformanceMonitor(false)}
      />

      {/* 读音修正演示 */}
      <PronunciationCorrectionDemo
        isVisible={showPronunciationDemo}
        onClose={() => setShowPronunciationDemo(false)}
      />
    </ErrorBoundary>
  );
}

export default App;
