import React, { useState } from 'react';
import { ArrowLeft, Volume2, ChevronRight, ChevronLeft, BookOpen, Sparkles, Star, Zap, Heart, PlayCircle } from 'lucide-react';
import { pepUnits, UnitData } from '../data/pepData';
import { useSpeech } from '../hooks/useSpeech';
import EnhancedSpeechButton from './EnhancedSpeechButton';
import BatchSpeechPlayer from './BatchSpeechPlayer';

interface UnitLearningProps {
  onBack: () => void;
}

type LearningMode = 'words' | 'phrases' | 'sentences';

const UnitLearning: React.FC<UnitLearningProps> = ({ onBack }) => {
  const [selectedUnit, setSelectedUnit] = useState<UnitData | null>(null);
  const [currentMode, setCurrentMode] = useState<LearningMode>('words');
  const [showBatchPlayer, setShowBatchPlayer] = useState(false);
  const { speak } = useSpeech();

  const getCurrentModeData = () => {
    if (!selectedUnit) return [];
    switch (currentMode) {
      case 'words':
        return selectedUnit.words;
      case 'phrases':
        return selectedUnit.phrases;
      case 'sentences':
        return selectedUnit.sentences;
      default:
        return [];
    }
  };

  // 为每个单元定义独特的渐变色彩和图标
  const getUnitStyle = (unitId: number) => {
    const styles = {
      1: {
        gradient: 'bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500',
        icon: Heart,
        glow: 'shadow-pink-500/30 hover:shadow-pink-500/50',
        border: 'border-pink-400/30 hover:border-pink-400/60',
        accent: 'text-pink-300'
      },
      2: {
        gradient: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500',
        icon: Sparkles,
        glow: 'shadow-blue-500/30 hover:shadow-blue-500/50',
        border: 'border-blue-400/30 hover:border-blue-400/60',
        accent: 'text-blue-300'
      },
      3: {
        gradient: 'bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500',
        icon: Star,
        glow: 'shadow-emerald-500/30 hover:shadow-emerald-500/50',
        border: 'border-emerald-400/30 hover:border-emerald-400/60',
        accent: 'text-emerald-300'
      },
      4: {
        gradient: 'bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500',
        icon: Zap,
        glow: 'shadow-purple-500/30 hover:shadow-purple-500/50',
        border: 'border-purple-400/30 hover:border-purple-400/60',
        accent: 'text-purple-300'
      },
      5: {
        gradient: 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500',
        icon: BookOpen,
        glow: 'shadow-amber-500/30 hover:shadow-amber-500/50',
        border: 'border-amber-400/30 hover:border-amber-400/60',
        accent: 'text-amber-300'
      }
    };
    return styles[unitId as keyof typeof styles] || styles[1];
  };

  const renderContent = () => {
    if (!selectedUnit) return null;

    const data = selectedUnit[currentMode];
    
    return (
      <div className="space-y-3 sm:space-y-4">
        {data.map((item: any, index: number) => (
          <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 sm:space-x-4 mb-2">
                  <span className="text-lg sm:text-2xl font-bold text-purple-400 truncate">
                    {item.english}
                  </span>
                  <EnhancedSpeechButton
                    text={item.english}
                    size="sm"
                    variant="primary"
                    className="flex-shrink-0"
                  />
                </div>
                <p className="text-gray-300 text-base sm:text-lg">{item.chinese}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (selectedUnit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* 移动端优化的顶部导航 */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <button
              onClick={() => setSelectedUnit(null)}
              className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 text-white active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">返回</span>
            </button>
            
            <div className="text-center flex-1 mx-4">
              <h2 className="text-xl sm:text-3xl font-bold text-white mb-1">{selectedUnit.title}</h2>
              <p className="text-purple-300 text-sm sm:text-base">{selectedUnit.subtitle}</p>
            </div>

            <button
              onClick={() => setShowBatchPlayer(!showBatchPlayer)}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg"
              title="批量播放"
            >
              <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>

          {/* 移动端优化的学习模式切换 */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-1 sm:p-2 border border-slate-700/50 w-full max-w-md">
              <div className="grid grid-cols-3 gap-1">
                {[
                  { key: 'words', label: '单词', count: selectedUnit.words.length },
                  { key: 'phrases', label: '短语', count: selectedUnit.phrases.length },
                  { key: 'sentences', label: '句子', count: selectedUnit.sentences.length }
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setCurrentMode(key as LearningMode)}
                    className={`px-2 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-xs sm:text-base active:scale-95 ${
                      currentMode === key
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="text-center">
                      <div>{label}</div>
                      <div className="text-xs opacity-75">({count})</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 批量播放器 */}
          {showBatchPlayer && (
            <div className="mb-6 sm:mb-8">
              <BatchSpeechPlayer
                textList={getCurrentModeData().map(item => item.english)}
                labels={getCurrentModeData().map(item => item.chinese)}
                title={`${selectedUnit.title} - ${currentMode === 'words' ? '单词' : currentMode === 'phrases' ? '短语' : '句子'}批量播放`}
                onComplete={() => {
                  console.log('批量播放完成');
                }}
                onProgress={(current, total) => {
                  console.log(`播放进度: ${current}/${total}`);
                }}
              />
            </div>
          )}

          {/* 内容区域 */}
          <div className="bg-slate-900/30 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-slate-700/30">
            {renderContent()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* 移动端优化的动态背景粒子 */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* 背景光效 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-[500px] sm:h-[500px] bg-gradient-to-r from-pink-600/5 to-orange-600/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '25s' }}></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* 移动端优化的返回按钮 */}
          <div className="flex items-center mb-6 sm:mb-8">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 text-white active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">返回主页</span>
            </button>
          </div>

          {/* 移动端优化的标题区域 */}
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg leading-tight">
              按单元学习
            </h2>
            <p className="text-lg sm:text-2xl text-gray-300 mb-3 sm:mb-4">选择一个单元开始系统学习</p>
            <div className="flex items-center justify-center space-x-2 text-purple-300">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              <span className="text-sm sm:text-lg">每个单元都有独特的学习体验</span>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* 移动端优化的单元卡片网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-2 sm:px-0">
            {pepUnits.map((unit) => {
              const style = getUnitStyle(unit.id);
              const IconComponent = style.icon;
              
              return (
                <div key={unit.id} className="relative group">
                  {/* 外部光晕效果 - 移动端减弱 */}
                  <div className={`absolute -inset-0.5 sm:-inset-1 ${style.gradient} rounded-2xl sm:rounded-3xl blur opacity-20 sm:opacity-30 group-hover:opacity-40 sm:group-hover:opacity-60 transition-opacity duration-500`}></div>
                  
                  <button
                    onClick={() => setSelectedUnit(unit)}
                    className={`
                      relative w-full h-full ${style.gradient} backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 
                      border-2 ${style.border} transition-all duration-500 group 
                      hover:scale-105 active:scale-95 transform shadow-xl sm:shadow-2xl ${style.glow}
                      overflow-hidden min-h-[280px] sm:min-h-[320px]
                    `}
                  >
                    {/* 内部光效动画 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                    
                    {/* 移动端优化的装饰性粒子 */}
                    <div className="absolute inset-0 overflow-hidden">
                      {Array.from({ length: 6 }, (_, i) => (
                        <div
                          key={i}
                          className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white/40 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            left: `${20 + i * 12}%`,
                            top: `${20 + (i % 3) * 25}%`,
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: '2s'
                          }}
                        />
                      ))}
                    </div>
                    
                    <div className="relative text-center h-full flex flex-col justify-between">
                      {/* 顶部图标区域 - 移动端优化 */}
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-500 shadow-xl group-hover:scale-110 group-hover:rotate-12">
                          <IconComponent className="w-7 h-7 sm:w-10 sm:h-10 text-white drop-shadow-lg" />
                        </div>
                        <div className="text-right">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                            {unit.id}
                          </div>
                        </div>
                      </div>
                      
                      {/* 中间内容区域 - 移动端优化 */}
                      <div className="flex-1 flex flex-col justify-center mb-4 sm:mb-6">
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg leading-tight">
                          {unit.title}
                        </h3>
                        <p className={`${style.accent} text-lg sm:text-xl font-semibold mb-3 sm:mb-4 drop-shadow-sm`}>
                          {unit.subtitle}
                        </p>
                        
                        {/* 学习内容统计 - 移动端优化 */}
                        <div className="flex justify-center space-x-4 sm:space-x-6 text-white/90">
                          <div className="text-center">
                            <div className="text-xl sm:text-2xl font-bold">{unit.words.length}</div>
                            <div className="text-xs sm:text-sm opacity-80">单词</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl sm:text-2xl font-bold">{unit.phrases.length}</div>
                            <div className="text-xs sm:text-sm opacity-80">短语</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl sm:text-2xl font-bold">{unit.sentences.length}</div>
                            <div className="text-xs sm:text-sm opacity-80">句子</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 底部进度条效果 */}
                      <div className="w-full h-1.5 sm:h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-white/40 to-white/80 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-lg"></div>
                      </div>
                    </div>
                    
                    {/* 悬浮时的箭头指示器 - 移动端优化 */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ChevronRight className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* 移动端优化的底部提示信息 */}
          <div className="text-center mt-12 sm:mt-16 px-4">
            <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 inline-block border border-slate-700/50 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 max-w-md sm:max-w-none">
              <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center animate-pulse">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <p className="text-gray-300 text-lg sm:text-xl font-semibold">
                  循序渐进，系统掌握每个知识点
                </p>
              </div>
              <p className="text-purple-400 font-bold text-base sm:text-lg bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Step by step, master every lesson! 一步一个脚印！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitLearning;