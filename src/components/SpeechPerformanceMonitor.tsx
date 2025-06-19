import React, { useState, useEffect } from 'react';
import { Activity, Zap, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { SpeechUtils } from '../utils/speechUtils';

interface SpeechPerformanceMonitorProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const SpeechPerformanceMonitor: React.FC<SpeechPerformanceMonitorProps> = ({ 
  isVisible = false, 
  onClose 
}) => {
  const [stats, setStats] = useState<any>(null);
  const [isWarmingUp, setIsWarmingUp] = useState(false);
  const [warmupTime, setWarmupTime] = useState<number | null>(null);

  useEffect(() => {
    if (isVisible) {
      updateStats();
      const interval = setInterval(updateStats, 1000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const updateStats = () => {
    const envInfo = SpeechUtils.getEnvironmentInfo();
    const playbackStats = SpeechUtils.getPlaybackStats();
    
    setStats({
      ...envInfo,
      ...playbackStats,
      isEngineWarmedUp: (SpeechUtils as any).isEngineWarmedUp,
      voicesLoaded: (SpeechUtils as any).voicesLoaded,
      voicesCount: (SpeechUtils as any).voicesCache?.length || 0,
      preferredVoice: (SpeechUtils as any).preferredVoice?.name || '未设置'
    });
  };

  const handleWarmup = async () => {
    setIsWarmingUp(true);
    setWarmupTime(null);
    
    const startTime = performance.now();
    
    try {
      await SpeechUtils.warmupSpeechEngine();
      const endTime = performance.now();
      setWarmupTime(Math.round(endTime - startTime));
    } catch (error) {
      console.error('预热失败:', error);
    } finally {
      setIsWarmingUp(false);
      updateStats();
    }
  };

  const testPerformance = async () => {
    const testText = 'Performance test';
    const startTime = performance.now();
    
    try {
      await SpeechUtils.speakText(testText);
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      alert(`语音响应时间: ${responseTime}ms`);
    } catch (error) {
      alert('性能测试失败');
    }
  };

  if (!isVisible || !stats) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-xl z-50 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-medium">语音性能监控</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        )}
      </div>

      <div className="space-y-2 text-sm">
        {/* 引擎状态 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">引擎状态:</span>
          <div className="flex items-center space-x-1">
            {stats.isEngineWarmedUp ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400">已预热</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400">未预热</span>
              </>
            )}
          </div>
        </div>

        {/* 语音列表 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">语音数量:</span>
          <span className="text-white">{stats.voicesCount}</span>
        </div>

        {/* 首选语音 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">首选语音:</span>
          <span className="text-white text-xs truncate max-w-24" title={stats.preferredVoice}>
            {stats.preferredVoice}
          </span>
        </div>

        {/* 支持级别 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">支持级别:</span>
          <span className={`text-xs px-2 py-1 rounded ${
            stats.supportLevel === 'full' ? 'bg-green-500/20 text-green-400' :
            stats.supportLevel === 'limited' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {stats.supportLevel === 'full' ? '完全' :
             stats.supportLevel === 'limited' ? '有限' : '不支持'}
          </span>
        </div>

        {/* 用户交互 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">用户交互:</span>
          <span className={stats.userInteracted ? 'text-green-400' : 'text-yellow-400'}>
            {stats.userInteracted ? '已激活' : '待激活'}
          </span>
        </div>

        {/* 预热时间 */}
        {warmupTime && (
          <div className="flex items-center justify-between">
            <span className="text-gray-300">预热耗时:</span>
            <span className="text-blue-400">{warmupTime}ms</span>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-2 mt-4">
        <button
          onClick={handleWarmup}
          disabled={isWarmingUp}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white text-xs py-2 px-3 rounded flex items-center justify-center space-x-1"
        >
          <Zap className="w-3 h-3" />
          <span>{isWarmingUp ? '预热中...' : '预热引擎'}</span>
        </button>
        
        <button
          onClick={testPerformance}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-2 px-3 rounded flex items-center justify-center space-x-1"
        >
          <Clock className="w-3 h-3" />
          <span>性能测试</span>
        </button>
      </div>

      {/* 环境信息 */}
      <div className="mt-3 pt-3 border-t border-slate-600">
        <div className="text-xs text-gray-400 space-y-1">
          <div>浏览器: {stats.isWeChat ? '微信' : '标准'}</div>
          <div>设备: {stats.isMobile ? '移动端' : '桌面端'}</div>
          {stats.isWeChat && stats.wechatVersion && (
            <div>微信版本: {stats.wechatVersion}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeechPerformanceMonitor;
