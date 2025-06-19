import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface SpeechButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  showStatus?: boolean;
}

const SpeechButton: React.FC<SpeechButtonProps> = ({
  text,
  className = '',
  size = 'md',
  variant = 'primary',
  showStatus = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { speak, isSupported, getEnvironmentInfo } = useSpeech();
  const [environmentInfo, setEnvironmentInfo] = useState(getEnvironmentInfo());

  useEffect(() => {
    setEnvironmentInfo(getEnvironmentInfo());
  }, [getEnvironmentInfo]);

  const handleSpeak = async () => {
    if (!isSupported()) return;

    // 更新环境信息
    const currentEnv = getEnvironmentInfo();
    setEnvironmentInfo(currentEnv);

    setIsPlaying(true);

    try {
      const success = await speak(text, {
        lang: 'en-US',
        showAlert: true
      });

      if (!success) {
        console.warn('语音播放失败');
      }
    } catch (error) {
      console.error('语音播放异常:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8';
      case 'lg': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-slate-600 hover:bg-slate-500';
      case 'ghost':
        return 'bg-transparent hover:bg-white/10 border border-white/20';
      default:
        return 'bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-8 h-8';
      default: return 'w-6 h-6';
    }
  };

  if (!isSupported()) {
    return (
      <div className={`${getSizeClasses()} bg-gray-500 rounded-full flex items-center justify-center ${className}`}>
        <VolumeX className={`${getIconSize()} text-white`} />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleSpeak}
        disabled={isPlaying}
        className={`
          ${getSizeClasses()}
          ${getVariantClasses()}
          rounded-full flex items-center justify-center transition-all duration-300 
          transform hover:scale-110 shadow-lg hover:shadow-purple-500/30
          ${isPlaying ? 'animate-pulse' : ''}
          ${className}
        `}
        title={environmentInfo.isWeChat ? '微信浏览器语音播放' : '点击播放语音'}
      >
        <Volume2 className={`${getIconSize()} text-white`} />
      </button>

      {/* 状态指示器 */}
      {showStatus && environmentInfo.isWeChat && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
            {environmentInfo.userInteracted ? (
              <span className="text-green-400">✓ 微信兼容</span>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 text-yellow-400" />
                <span className="text-yellow-400">需要交互</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechButton;