import React, { useEffect, useState } from 'react';
import { Trophy, Star, RotateCcw, ArrowLeft, Eye, Zap, Crown, Award, Target, TrendingUp } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  speed: number;
}

interface ChallengeResultProps {
  score: number;
  totalQuestions: number;
  wrongAnswers: any[];
  onRestart: () => void;
  onBack: () => void;
  onShowWrongAnswers: () => void;
}

const ChallengeResult: React.FC<ChallengeResultProps> = ({
  score,
  totalQuestions,
  wrongAnswers,
  onRestart,
  onBack,
  onShowWrongAnswers
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [confetti, setConfetti] = useState<Particle[]>([]);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // 生成背景粒子
    const newParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'][i % 4],
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 1
      });
    }
    setParticles(newParticles);

    // 如果满分，生成撒花特效
    if (score === totalQuestions) {
      const newConfetti: Particle[] = [];
      for (let i = 0; i < 100; i++) {
        newConfetti.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][i % 6],
          size: Math.random() * 8 + 4,
          speed: Math.random() * 3 + 1
        });
      }
      setConfetti(newConfetti);
    }

    // 延迟显示统计信息
    setTimeout(() => setShowStats(true), 1000);
  }, [score, totalQuestions]);

  const getScoreColor = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage === 100) return 'text-yellow-400';
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-blue-400';
    if (percentage >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getPerformanceLevel = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage === 100) return { level: 'LEGENDARY', icon: Crown, color: 'from-yellow-400 to-orange-400' };
    if (percentage >= 80) return { level: 'EXCELLENT', icon: Award, color: 'from-green-400 to-emerald-400' };
    if (percentage >= 60) return { level: 'GOOD', icon: Target, color: 'from-blue-400 to-cyan-400' };
    if (percentage >= 40) return { level: 'FAIR', icon: TrendingUp, color: 'from-orange-400 to-yellow-400' };
    return { level: 'NEEDS WORK', icon: Target, color: 'from-red-400 to-pink-400' };
  };

  const performance = getPerformanceLevel();
  const IconComponent = performance.icon;
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 relative overflow-hidden">
      {/* 3D 动态背景层 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 主要粒子系统 */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `radial-gradient(circle, ${particle.color}80, transparent)`,
              animationDelay: `${particle.id * 0.1}s`,
              animationDuration: `${2 + Math.random() * 4}s`,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}40`
            }}
          />
        ))}
        
        {/* 流星效果 */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent animate-pulse"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* 光环效果 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-purple-600/10 via-blue-600/5 to-transparent rounded-full animate-spin-slow"></div>
      </div>
      
      {/* 撒花特效增强 */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute rounded-full animate-bounce shadow-lg"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            background: `linear-gradient(45deg, ${piece.color}, ${piece.color}80)`,
            animationDelay: `${piece.id * 0.1}s`,
            animationDuration: `${1 + Math.random() * 2}s`,
            boxShadow: `0 0 ${piece.size}px ${piece.color}60`
          }}
        />
      ))}
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6">
        <div className="text-center max-w-6xl mx-auto">
          {/* 全新成就展示区域 */}
          <div className="relative mb-8 sm:mb-12">
            {/* 主要成就徽章 */}
            <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48">
              {/* 外层光环 */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 via-orange-500/40 to-red-500/30 rounded-full animate-spin-slow blur-sm"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-purple-500/40 via-blue-500/50 to-cyan-500/40 rounded-full animate-spin-reverse blur-sm"></div>
              
              {/* 中层装饰环 */}
              <div className={`absolute inset-6 bg-gradient-to-br ${performance.color} rounded-full shadow-2xl shadow-yellow-500/50 animate-pulse`}>
                <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
              </div>
              
              {/* 核心图标 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <IconComponent className="w-20 h-20 sm:w-24 sm:h-24 text-white drop-shadow-2xl animate-bounce" />
              </div>

              {/* 满分特效 */}
              {score === totalQuestions && (
                <>
                  {/* 环绕粒子 */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-4 h-4 bg-yellow-400 rounded-full animate-ping shadow-lg shadow-yellow-400/50"
                      style={{
                        top: `${50 + 45 * Math.sin((i * Math.PI * 2) / 12)}%`,
                        left: `${50 + 45 * Math.cos((i * Math.PI * 2) / 12)}%`,
                        animationDelay: `${i * 0.15}s`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  ))}
                  
                  {/* 闪烁星星 */}
                  {[...Array(16)].map((_, i) => (
                    <div
                      key={`star-${i}`}
                      className="absolute text-yellow-300 animate-pulse"
                      style={{
                        top: `${50 + 65 * Math.sin((i * Math.PI * 2) / 16)}%`,
                        left: `${50 + 65 * Math.cos((i * Math.PI * 2) / 16)}%`,
                        animationDelay: `${i * 0.1}s`,
                        transform: 'translate(-50%, -50%)',
                        fontSize: `${16 + Math.random() * 8}px`
                      }}
                    >
                      ✨
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          
          {/* 动态标题 */}
          <div className="mb-8 sm:mb-10">
            <div className="relative mb-4">
              <h1 className="text-5xl sm:text-7xl font-black mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                {score === totalQuestions ? 'PERFECT!' : 'COMPLETE!'}
              </h1>
              {score === totalQuestions && (
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 rounded-lg animate-pulse blur-lg"></div>
              )}
            </div>
            

          </div>

          {/* 分数展示区域 - 全新设计 */}
          <div className="relative mb-16 sm:mb-20">
            <div className="relative inline-block">
              {/* 分数背景光效 */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/30 to-purple-600/20 rounded-3xl blur-2xl animate-pulse"></div>

              {/* 主分数显示 */}
              <div className={`relative text-8xl sm:text-9xl font-black ${getScoreColor()} drop-shadow-2xl px-8 py-6 mb-8`}>
                <span className="relative z-10">{score}</span>
                <span className="text-4xl sm:text-5xl text-gray-400 mx-3">/</span>
                <span className="text-4xl sm:text-5xl text-gray-400">{totalQuestions}</span>

                {/* 分数装饰效果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse rounded-3xl"></div>
              </div>
            </div>

            {/* 百分比显示 - 移到分数下方 */}
            <div className="flex justify-center mt-6">
              <div className={`bg-gradient-to-r ${performance.color} backdrop-blur-sm rounded-2xl px-8 py-4 border-2 border-white/20 shadow-2xl`}>
                <span className="text-3xl font-black text-white drop-shadow-lg">
                  {percentage}%
                </span>
              </div>
            </div>
          </div>

          {/* 统计信息 - 动画展示 */}
          {showStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-10 animate-fade-in">
              <div className="bg-green-600/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30 hover:scale-105 transition-transform">
                <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">{score}</div>
                <div className="text-sm text-green-300 font-semibold">正确</div>
              </div>
              <div className="bg-red-600/20 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30 hover:scale-105 transition-transform">
                <div className="text-3xl sm:text-4xl font-bold text-red-400 mb-2">{totalQuestions - score}</div>
                <div className="text-sm text-red-300 font-semibold">错误</div>
              </div>
              <div className="bg-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 hover:scale-105 transition-transform">
                <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">{percentage}%</div>
                <div className="text-sm text-blue-300 font-semibold">正确率</div>
              </div>
              <div className="bg-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:scale-105 transition-transform">
                <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2">{totalQuestions}</div>
                <div className="text-sm text-purple-300 font-semibold">总题数</div>
              </div>
            </div>
          )}
          
          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button
              onClick={onRestart}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-purple-500/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center space-x-3">
                <RotateCcw className="w-6 h-6" />
                <span>再来一次</span>
              </div>
            </button>
            
            {wrongAnswers.length > 0 && (
              <button
                onClick={onShowWrongAnswers}
                className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-red-500/30 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center space-x-3">
                  <Eye className="w-6 h-6" />
                  <span>查看错题 ({wrongAnswers.length})</span>
                </div>
              </button>
            )}
            
            <button
              onClick={onBack}
              className="group relative px-8 py-4 bg-slate-700/80 hover:bg-slate-600/80 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center space-x-3">
                <ArrowLeft className="w-6 h-6" />
                <span>返回主页</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeResult;
