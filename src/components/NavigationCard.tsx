import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavigationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  onClick: () => void;
}

const NavigationCard: React.FC<NavigationCardProps> = ({
  title,
  description,
  icon: Icon,
  gradient,
  onClick
}) => {
  return (
    <div className="relative group h-full">
      <button
        onClick={onClick}
        className={`${gradient} rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl hover:scale-105 active:scale-95 transform transition-all duration-500 text-left w-full h-full group border border-white/20 hover:border-white/40 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between min-h-[240px] sm:min-h-[280px]`}
      >
        {/* 背景光效 */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* 内容 */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* 顶部区域 */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-500 shadow-xl group-hover:scale-110">
              <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg" />
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500 shadow-lg">
              <span className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">→</span>
            </div>
          </div>
          
          {/* 中间内容区域 */}
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-white drop-shadow-lg leading-tight">{title}</h3>
            <p className="text-white/90 text-base sm:text-lg leading-relaxed drop-shadow-sm line-clamp-3">{description}</p>
          </div>
          
          {/* 底部进度条效果 */}
          <div className="mt-4 sm:mt-6 w-full h-1.5 sm:h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-white/40 to-white/80 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-lg"></div>
          </div>
        </div>
        
        {/* 移动端优化的悬浮粒子效果 */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white/60 rounded-full animate-pulse"
              style={{
                left: `${25 + i * 20}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </button>
      
      {/* 外部光晕效果 */}
      <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 rounded-2xl sm:rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
    </div>
  );
};

export default NavigationCard;