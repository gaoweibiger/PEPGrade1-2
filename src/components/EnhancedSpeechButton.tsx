import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, AlertCircle, Loader2, CheckCircle, Settings } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import SpeechTroubleshooter from './SpeechTroubleshooter';

interface EnhancedSpeechButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost' | 'minimal';
  showStatus?: boolean;
  showText?: boolean;
  autoRetry?: boolean;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onSpeechError?: (error: string) => void;
}

const EnhancedSpeechButton: React.FC<EnhancedSpeechButtonProps> = ({
  text,
  className = '',
  size = 'md',
  variant = 'primary',
  showStatus = false,
  showText = false,
  autoRetry = true,
  onSpeechStart,
  onSpeechEnd,
  onSpeechError
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playStatus, setPlayStatus] = useState<'idle' | 'loading' | 'playing' | 'success' | 'error'>('idle');
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string>('');
  const [showTroubleshooter, setShowTroubleshooter] = useState(false);
  const { speak, isSupported, getEnvironmentInfo } = useSpeech();
  const [environmentInfo, setEnvironmentInfo] = useState(getEnvironmentInfo());

  useEffect(() => {
    setEnvironmentInfo(getEnvironmentInfo());
  }, [getEnvironmentInfo]);

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
        return 'bg-slate-600 hover:bg-slate-500 border border-slate-500';
      case 'ghost':
        return 'bg-transparent hover:bg-white/10 border border-white/20';
      case 'minimal':
        return 'bg-transparent hover:bg-purple-500/20 border-0';
      default:
        return 'bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-0';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-8 h-8';
      default: return 'w-6 h-6';
    }
  };

  const getStatusIcon = () => {
    switch (playStatus) {
      case 'loading':
        return <Loader2 className={`${getIconSize()} text-white animate-spin`} />;
      case 'playing':
        return <Volume2 className={`${getIconSize()} text-white animate-pulse`} />;
      case 'success':
        return <CheckCircle className={`${getIconSize()} text-green-400`} />;
      case 'error':
        return <AlertCircle className={`${getIconSize()} text-red-400`} />;
      default:
        return <Volume2 className={`${getIconSize()} text-white`} />;
    }
  };

  const handleSpeak = async () => {
    if (!isSupported()) {
      setPlayStatus('error');
      onSpeechError?.('语音功能不支持');
      return;
    }

    // 更新环境信息
    const currentEnv = getEnvironmentInfo();
    setEnvironmentInfo(currentEnv);

    setIsPlaying(true);
    setPlayStatus('loading');
    onSpeechStart?.();
    
    try {
      const success = await speak(text, {
        lang: 'en-US',
        showAlert: retryCount === 0 // 只在第一次尝试时显示提示
      });
      
      if (success) {
        setPlayStatus('success');
        setRetryCount(0);
        onSpeechEnd?.();
        
        // 2秒后重置状态
        setTimeout(() => {
          setPlayStatus('idle');
        }, 2000);
      } else {
        throw new Error('语音播放失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '语音播放失败';
      console.error('语音播放异常:', error);
      setPlayStatus('error');
      setLastError(errorMessage);

      // 检查是否是 synthesis-failed 错误
      const isSynthesisFailed = errorMessage.includes('synthesis-failed');

      // 自动重试逻辑
      if (autoRetry && retryCount < 2 && !isSynthesisFailed) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          handleSpeak();
        }, 1000);
      } else {
        onSpeechError?.(errorMessage);
        setRetryCount(0);

        // 对于 synthesis-failed 错误，显示故障排除器
        if (isSynthesisFailed) {
          setTimeout(() => {
            setShowTroubleshooter(true);
          }, 1000);
        }

        // 3秒后重置状态
        setTimeout(() => {
          setPlayStatus('idle');
        }, 3000);
      }
    } finally {
      setIsPlaying(false);
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
    <div className="relative group">
      <button
        onClick={handleSpeak}
        disabled={isPlaying}
        className={`
          ${getSizeClasses()}
          ${getVariantClasses()}
          rounded-full flex items-center justify-center transition-all duration-300 
          transform hover:scale-110 shadow-lg hover:shadow-purple-500/30
          ${isPlaying ? 'cursor-wait' : 'cursor-pointer'}
          ${playStatus === 'success' ? 'ring-2 ring-green-400' : ''}
          ${playStatus === 'error' ? 'ring-2 ring-red-400' : ''}
          ${className}
        `}
        title={
          environmentInfo.isWeChat 
            ? '微信浏览器语音播放' 
            : `点击播放: ${text}`
        }
      >
        {getStatusIcon()}
      </button>

      {/* 文本显示 */}
      {showText && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap">
          <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg">
            {text}
          </div>
        </div>
      )}

      {/* 状态指示器 */}
      {showStatus && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
            {environmentInfo.isWeChat ? (
              environmentInfo.userInteracted ? (
                <span className="text-green-400">✓ 微信兼容</span>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-yellow-400" />
                  <span className="text-yellow-400">需要交互</span>
                </>
              )
            ) : (
              <span className="text-blue-400">✓ 语音就绪</span>
            )}
          </div>
        </div>
      )}

      {/* 重试指示器 */}
      {retryCount > 0 && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">{retryCount}</span>
        </div>
      )}

      {/* 悬浮提示 */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
          {playStatus === 'idle' && '点击播放语音'}
          {playStatus === 'loading' && '正在加载...'}
          {playStatus === 'playing' && '正在播放...'}
          {playStatus === 'success' && '播放成功！'}
          {playStatus === 'error' && (
            <div className="flex items-center space-x-1">
              <span>播放失败</span>
              {lastError.includes('synthesis-failed') && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTroubleshooter(true);
                  }}
                  className="ml-1 text-blue-400 hover:text-blue-300 pointer-events-auto"
                >
                  <Settings className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
        </div>
      </div>

      {/* 故障排除器 */}
      {showTroubleshooter && (
        <SpeechTroubleshooter
          onClose={() => setShowTroubleshooter(false)}
          error={lastError.includes('synthesis-failed') ? 'synthesis-failed' : undefined}
        />
      )}
    </div>
  );
};

export default EnhancedSpeechButton;
