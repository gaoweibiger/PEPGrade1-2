import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, AlertCircle, Loader2, CheckCircle, Settings } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import SpeechTroubleshooter from './SpeechTroubleshooter';

// 全局语音播放管理器
class GlobalSpeechManager {
  private static instance: GlobalSpeechManager;
  private currentPlayingId: string | null = null;
  private currentRetryId: string | null = null;
  private listeners: Map<string, (isActive: boolean) => void> = new Map();

  static getInstance(): GlobalSpeechManager {
    if (!GlobalSpeechManager.instance) {
      GlobalSpeechManager.instance = new GlobalSpeechManager();
    }
    return GlobalSpeechManager.instance;
  }

  // 注册语音按钮
  register(id: string, callback: (isActive: boolean) => void) {
    this.listeners.set(id, callback);
  }

  // 注销语音按钮
  unregister(id: string) {
    this.listeners.delete(id);
    if (this.currentPlayingId === id) {
      this.currentPlayingId = null;
    }
    if (this.currentRetryId === id) {
      this.currentRetryId = null;
    }
  }

  // 请求播放权限
  requestPlay(id: string): boolean {
    if (this.currentPlayingId && this.currentPlayingId !== id) {
      return false; // 其他按钮正在播放
    }
    this.currentPlayingId = id;
    this.notifyListeners(id);
    return true;
  }

  // 请求重试权限
  requestRetry(id: string): boolean {
    if (this.currentRetryId && this.currentRetryId !== id) {
      return false; // 其他按钮正在重试
    }
    this.currentRetryId = id;
    this.notifyListeners(id);
    return true;
  }

  // 释放播放权限
  releasePlay(id: string) {
    if (this.currentPlayingId === id) {
      this.currentPlayingId = null;
      this.notifyListeners(null);
    }
  }

  // 释放重试权限
  releaseRetry(id: string) {
    if (this.currentRetryId === id) {
      this.currentRetryId = null;
      this.notifyListeners(null);
    }
  }

  // 检查是否可以播放
  canPlay(id: string): boolean {
    return !this.currentPlayingId || this.currentPlayingId === id;
  }

  // 检查是否可以重试
  canRetry(id: string): boolean {
    return !this.currentRetryId || this.currentRetryId === id;
  }

  // 通知所有监听器
  private notifyListeners(activeId: string | null) {
    this.listeners.forEach((callback, id) => {
      callback(activeId === id);
    });
  }
}

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
  const [isGloballyActive, setIsGloballyActive] = useState(false);
  const { speak, isSupported, getEnvironmentInfo } = useSpeech();
  const [environmentInfo, setEnvironmentInfo] = useState(getEnvironmentInfo());
  const [isMounted, setIsMounted] = useState(true);
  const buttonIdRef = useRef<string>(`speech-btn-${Math.random().toString(36).substr(2, 9)}`);
  const globalManager = GlobalSpeechManager.getInstance();

  useEffect(() => {
    setEnvironmentInfo(getEnvironmentInfo());
  }, [getEnvironmentInfo]);

  // 组件卸载时清理
  useEffect(() => {
    const buttonId = buttonIdRef.current;
    // 注册到全局管理器
    globalManager.register(buttonId, setIsGloballyActive);

    return () => {
      setIsMounted(false);
      // 从全局管理器注销
      globalManager.unregister(buttonId);
    };
  }, [globalManager]);

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
    const buttonId = buttonIdRef.current;

    // 防止重复点击和死循环
    if (isPlaying) {
      console.log('语音正在播放中，忽略重复点击');
      return;
    }

    // 检查全局播放权限
    if (!globalManager.canPlay(buttonId)) {
      console.log('其他语音正在播放，忽略当前请求');
      return;
    }

    if (!isSupported()) {
      setPlayStatus('error');
      onSpeechError?.('语音功能不支持');
      return;
    }

    // 请求播放权限
    if (!globalManager.requestPlay(buttonId)) {
      console.log('无法获取播放权限');
      return;
    }

    // 更新环境信息
    const currentEnv = getEnvironmentInfo();
    setEnvironmentInfo(currentEnv);

    setIsPlaying(true);
    setPlayStatus('loading');
    setLastError(''); // 清除之前的错误
    onSpeechStart?.();
    
    try {
      const success = await speak(text, {
        lang: 'en-US',
        showAlert: retryCount === 0 // 只在第一次尝试时显示提示
      });

      if (success) {
        setPlayStatus('success');
        setRetryCount(0);
        globalManager.releasePlay(buttonId);
        globalManager.releaseRetry(buttonId);
        onSpeechEnd?.();

        // 2秒后重置状态
        setTimeout(() => {
          if (isMounted) {
            setPlayStatus('idle');
          }
        }, 2000);
      } else {
        // 播放失败，但不抛出异常，而是直接处理失败情况
        console.warn('语音播放返回失败状态');
        setPlayStatus('error');
        setLastError('语音播放失败');

        // 检查环境信息来确定失败原因
        const envInfo = getEnvironmentInfo();
        let failureReason = '语音播放失败';

        if (!envInfo.speechSupported) {
          failureReason = '浏览器不支持语音合成';
        } else if (envInfo.isWeChat && !envInfo.userInteracted) {
          failureReason = '需要先与页面交互';
        } else if (envInfo.isWechatMiniProgram) {
          failureReason = '微信小程序不支持语音';
        }

        setLastError(failureReason);

        // 自动重试逻辑 - 最多重试2次，避免死循环
        if (autoRetry && retryCount < 2 && globalManager.canRetry(buttonId)) {
          const nextRetryCount = retryCount + 1;
          console.log(`准备重试播放 (${nextRetryCount}/2): ${text}`);
          setRetryCount(nextRetryCount);

          // 请求重试权限
          if (globalManager.requestRetry(buttonId)) {
            // 递增延迟：第1次重试1.5秒，第2次重试3秒
            const retryDelay = nextRetryCount * 1500;
            setTimeout(() => {
              // 检查组件是否仍然挂载和是否仍有重试权限
              if (isMounted && globalManager.canRetry(buttonId)) {
                handleSpeak();
              } else {
                console.log('组件已卸载或失去重试权限，取消重试');
                globalManager.releasePlay(buttonId);
                globalManager.releaseRetry(buttonId);
              }
            }, retryDelay);
          } else {
            console.log('无法获取重试权限，停止重试');
            globalManager.releasePlay(buttonId);
            onSpeechError?.(failureReason);
            setRetryCount(0);
            setTimeout(() => {
              if (isMounted) {
                setPlayStatus('idle');
              }
            }, 3000);
          }
        } else {
          // 达到最大重试次数或不自动重试
          if (retryCount >= 2) {
            console.warn(`已达到最大重试次数(2次)，停止重试: ${text}`);
          } else if (!globalManager.canRetry(buttonId)) {
            console.log('其他按钮正在重试，停止当前重试');
          }

          globalManager.releasePlay(buttonId);
          globalManager.releaseRetry(buttonId);
          onSpeechError?.(failureReason);
          setRetryCount(0); // 重置重试计数

          // 3秒后重置状态
          setTimeout(() => {
            if (isMounted) {
              setPlayStatus('idle');
            }
          }, 3000);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '语音播放异常';
      console.error('语音播放异常:', error);
      setPlayStatus('error');
      setLastError(errorMessage);

      // 检查是否是致命错误（不应重试）
      const isFatalError = errorMessage.includes('synthesis-failed') ||
                          errorMessage.includes('not supported') ||
                          errorMessage.includes('permission denied') ||
                          errorMessage.includes('network error');

      // 自动重试逻辑（仅对非致命错误进行重试）
      if (autoRetry && retryCount < 2 && !isFatalError && globalManager.canRetry(buttonId)) {
        const nextRetryCount = retryCount + 1;
        console.log(`异常重试 (${nextRetryCount}/2): ${errorMessage}`);
        setRetryCount(nextRetryCount);

        // 请求重试权限
        if (globalManager.requestRetry(buttonId)) {
          // 递增延迟：第1次重试1秒，第2次重试2秒
          const retryDelay = nextRetryCount * 1000;
          setTimeout(() => {
            // 检查组件是否仍然挂载和是否仍有重试权限
            if (isMounted && globalManager.canRetry(buttonId)) {
              handleSpeak();
            } else {
              console.log('组件已卸载或失去重试权限，取消异常重试');
              globalManager.releasePlay(buttonId);
              globalManager.releaseRetry(buttonId);
            }
          }, retryDelay);
        } else {
          console.log('无法获取异常重试权限，停止重试');
          globalManager.releasePlay(buttonId);
          onSpeechError?.(errorMessage);
          setRetryCount(0);
          setTimeout(() => {
            if (isMounted) {
              setPlayStatus('idle');
            }
          }, 3000);
        }
      } else {
        // 不重试的情况
        if (isFatalError) {
          console.warn(`致命错误，不重试: ${errorMessage}`);
        } else if (retryCount >= 2) {
          console.warn(`异常重试次数已达上限，停止重试: ${errorMessage}`);
        } else if (!globalManager.canRetry(buttonId)) {
          console.log('其他按钮正在重试，停止当前异常重试');
        }

        globalManager.releasePlay(buttonId);
        globalManager.releaseRetry(buttonId);
        onSpeechError?.(errorMessage);
        setRetryCount(0); // 重置重试计数

        // 对于致命错误，显示故障排除器
        if (isFatalError) {
          setTimeout(() => {
            if (isMounted) {
              setShowTroubleshooter(true);
            }
          }, 1000);
        }

        // 3秒后重置状态
        setTimeout(() => {
          if (isMounted) {
            setPlayStatus('idle');
          }
        }, 3000);
      }
    } finally {
      setIsPlaying(false);
      // 如果没有进入重试逻辑，确保释放权限
      if (playStatus !== 'loading' || retryCount === 0) {
        globalManager.releasePlay(buttonId);
      }
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
        disabled={isPlaying || (!isGloballyActive && !globalManager.canPlay(buttonIdRef.current))}
        className={`
          ${getSizeClasses()}
          ${getVariantClasses()}
          rounded-full flex items-center justify-center transition-all duration-300
          transform hover:scale-110 shadow-lg hover:shadow-purple-500/30
          ${isPlaying ? 'cursor-wait' : 'cursor-pointer'}
          ${!isGloballyActive && !globalManager.canPlay(buttonIdRef.current) ? 'opacity-50 cursor-not-allowed' : ''}
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
