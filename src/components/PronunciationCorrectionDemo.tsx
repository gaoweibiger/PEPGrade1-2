import React, { useState, useEffect } from 'react';
import { Volume2, Eye, Settings, BookOpen, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface PronunciationCorrectionDemoProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const PronunciationCorrectionDemo: React.FC<PronunciationCorrectionDemoProps> = ({ 
  isVisible = false, 
  onClose 
}) => {
  const [testText, setTestText] = useState('Mr Smith said hello at 3:00 PM. He works for NASA and has a PhD.');
  const [correctionPreview, setCorrectionPreview] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [correctionEnabled, setCorrectionEnabled] = useState(true);
  const [showCorrectionInfo, setShowCorrectionInfo] = useState(true);

  const {
    speak,
    previewPronunciationCorrection,
    setPronunciationCorrectionEnabled,
    isPronunciationCorrectionEnabled,
    getSupportedAbbreviations
  } = useSpeech();

  useEffect(() => {
    if (isVisible) {
      updatePreview();
      setCorrectionEnabled(isPronunciationCorrectionEnabled());
    }
  }, [isVisible, testText]);

  const updatePreview = () => {
    if (testText.trim()) {
      const preview = previewPronunciationCorrection(testText);
      setCorrectionPreview(preview);
    }
  };

  const handlePlay = async (useCorrection: boolean) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    
    try {
      await speak(testText, {
        enablePronunciationCorrection: useCorrection,
        showCorrectionInfo: showCorrectionInfo
      });
    } catch (error) {
      console.error('播放失败:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleToggleCorrection = () => {
    const newState = !correctionEnabled;
    setCorrectionEnabled(newState);
    setPronunciationCorrectionEnabled(newState);
  };

  const commonTestTexts = [
    'Mr Smith said hello at 3:00 PM.',
    'Dr Johnson works for NASA and has a PhD.',
    'The CEO of IBM will speak at 9:00 AM.',
    'Mrs Brown bought 5 kg of apples.',
    'Prof Wilson teaches AI and ML courses.',
    'The FBI and CIA work with the UN.',
    'I need to check my email ASAP.',
    'The URL is www.example.com.',
    'He got his MBA from MIT in the US.',
    'The GPS shows we are 10 km from NYC.'
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">读音修正演示</h2>
              <p className="text-sm text-gray-400">体验智能读音修正功能</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ×
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：测试区域 */}
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">测试文本</label>
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="w-full h-32 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="输入要测试的英文文本..."
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-400">快速测试:</span>
              {commonTestTexts.slice(0, 3).map((text, index) => (
                <button
                  key={index}
                  onClick={() => setTestText(text)}
                  className="text-xs bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded transition-colors"
                >
                  示例 {index + 1}
                </button>
              ))}
            </div>

            {/* 设置 */}
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                播放设置
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={correctionEnabled}
                    onChange={handleToggleCorrection}
                    className="w-4 h-4 text-purple-600 bg-slate-600 border-slate-500 rounded focus:ring-purple-500"
                  />
                  <span className="text-white text-sm">启用读音修正</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={showCorrectionInfo}
                    onChange={(e) => setShowCorrectionInfo(e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-slate-600 border-slate-500 rounded focus:ring-purple-500"
                  />
                  <span className="text-white text-sm">显示修正信息</span>
                </label>
              </div>
            </div>

            {/* 播放按钮 */}
            <div className="flex space-x-3">
              <button
                onClick={() => handlePlay(false)}
                disabled={isPlaying}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Volume2 className="w-4 h-4" />
                <span>原始读音</span>
              </button>
              
              <button
                onClick={() => handlePlay(true)}
                disabled={isPlaying}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>修正读音</span>
              </button>
            </div>
          </div>

          {/* 右侧：预览区域 */}
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-3 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                修正预览
              </h3>
              
              {correctionPreview && (
                <div className="space-y-3">
                  {/* 原始文本 */}
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="text-sm text-gray-400 mb-1">原始文本:</div>
                    <div className="text-white font-mono text-sm">{correctionPreview.original}</div>
                  </div>

                  {/* 修正后文本 */}
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="text-sm text-gray-400 mb-1">修正后文本:</div>
                    <div className="text-white font-mono text-sm">{correctionPreview.corrected}</div>
                  </div>

                  {/* 修正详情 */}
                  {correctionPreview.corrections && correctionPreview.corrections.length > 0 && (
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <div className="text-sm text-gray-400 mb-2">应用的修正:</div>
                      <div className="space-y-2">
                        {correctionPreview.corrections.map((correction: any, index: number) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span className="text-red-300 font-mono">{correction.original}</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-green-300 font-mono">{correction.corrected}</span>
                            <span className="text-blue-300 bg-blue-500/20 px-2 py-1 rounded">
                              {correction.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 状态指示 */}
                  <div className="flex items-center space-x-2">
                    {correctionPreview.needsCorrection ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm">需要读音修正</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">读音标准</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 更多测试文本 */}
            <div>
              <h3 className="text-white font-medium mb-3">更多测试示例</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {commonTestTexts.map((text, index) => (
                  <button
                    key={index}
                    onClick={() => setTestText(text)}
                    className="w-full text-left bg-slate-700/30 hover:bg-slate-700/50 text-white text-xs p-2 rounded transition-colors"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 说明 */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <h4 className="text-blue-300 font-medium mb-2">功能说明</h4>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• <strong>缩写词修正</strong>: Mr → Mister, Dr → Doctor, NASA → N A S A</li>
            <li>• <strong>时间修正</strong>: 3:00 → three o clock, PM → pee em</li>
            <li>• <strong>数字修正</strong>: 5 → five, 21 → twenty one</li>
            <li>• <strong>单位修正</strong>: kg → kilogram, km → kilometer</li>
            <li>• <strong>符号修正</strong>: & → and, @ → at</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PronunciationCorrectionDemo;
