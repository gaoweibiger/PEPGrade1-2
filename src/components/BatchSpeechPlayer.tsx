import React, { useState } from 'react';
import { Play, Pause, Square, SkipForward, Volume2, Settings, CheckCircle, XCircle } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface BatchSpeechPlayerProps {
  textList: string[];
  labels?: string[];
  title?: string;
  className?: string;
  onComplete?: () => void;
  onProgress?: (current: number, total: number) => void;
}

const BatchSpeechPlayer: React.FC<BatchSpeechPlayerProps> = ({
  textList,
  labels,
  title = '批量播放',
  className = '',
  onComplete,
  onProgress
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playResults, setPlayResults] = useState<boolean[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    interval: 1500,
    rate: 0.8,
    autoNext: true
  });

  const { speakList, speak, stop, getEnvironmentInfo } = useSpeech();

  const handlePlayAll = async () => {
    if (isPlaying) {
      stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    setCurrentIndex(0);
    setPlayResults([]);

    try {
      const results = await speakList(textList, {
        lang: 'en-US',
        rate: settings.rate,
        interval: settings.interval,
        showAlert: true
      });

      setPlayResults(results);
      onComplete?.();
    } catch (error) {
      console.error('批量播放失败:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handlePlaySingle = async (index: number) => {
    if (index >= textList.length) return;

    setCurrentIndex(index);
    const success = await speak(textList[index], {
      lang: 'en-US',
      rate: settings.rate,
      showAlert: true
    });

    // 更新播放结果
    const newResults = [...playResults];
    newResults[index] = success;
    setPlayResults(newResults);

    onProgress?.(index + 1, textList.length);

    // 自动播放下一个
    if (settings.autoNext && success && index < textList.length - 1) {
      setTimeout(() => {
        handlePlaySingle(index + 1);
      }, settings.interval);
    }
  };

  const getStatusIcon = (index: number) => {
    if (playResults[index] === true) {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    } else if (playResults[index] === false) {
      return <XCircle className="w-4 h-4 text-red-400" />;
    } else if (currentIndex === index && isPlaying) {
      return <Volume2 className="w-4 h-4 text-blue-400 animate-pulse" />;
    }
    return null;
  };

  return (
    <div className={`bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 border border-slate-700/50 ${className}`}>
      {/* 头部控制区 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Volume2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-400">{textList.length} 项内容</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors"
          >
            <Settings className="w-4 h-4 text-gray-300" />
          </button>
          
          <button
            onClick={handlePlayAll}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              isPlaying
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-green-600 hover:bg-green-500 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4" />
                <span>停止</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>全部播放</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 设置面板 */}
      {showSettings && (
        <div className="bg-slate-700/50 rounded-lg p-4 mb-4 border border-slate-600/50">
          <h4 className="font-medium text-white mb-3">播放设置</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">播放间隔 (毫秒)</label>
              <input
                type="range"
                min="500"
                max="3000"
                step="100"
                value={settings.interval}
                onChange={(e) => setSettings(prev => ({ ...prev, interval: parseInt(e.target.value) }))}
                className="w-full"
              />
              <span className="text-xs text-gray-400">{settings.interval}ms</span>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">播放速度</label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={settings.rate}
                onChange={(e) => setSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                className="w-full"
              />
              <span className="text-xs text-gray-400">{settings.rate}x</span>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={settings.autoNext}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoNext: e.target.checked }))}
                  className="rounded"
                />
                <span>自动播放下一个</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 内容列表 */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {textList.map((text, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              currentIndex === index && isPlaying
                ? 'bg-blue-500/20 border border-blue-500/50'
                : 'bg-slate-700/30 hover:bg-slate-700/50'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 font-mono">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {labels && (
                  <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded">
                    {labels[index]}
                  </span>
                )}
              </div>
              <p className="text-white text-sm mt-1 truncate">{text}</p>
            </div>
            
            <div className="flex items-center space-x-2 ml-3">
              {getStatusIcon(index)}
              <button
                onClick={() => handlePlaySingle(index)}
                className="w-8 h-8 bg-purple-600 hover:bg-purple-500 rounded-full flex items-center justify-center transition-colors"
              >
                <Play className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 进度指示器 */}
      {playResults.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">播放进度</span>
            <span className="text-white">
              {playResults.filter(Boolean).length} / {textList.length}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(playResults.filter(Boolean).length / textList.length) * 100}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchSpeechPlayer;
