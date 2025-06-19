import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Smartphone, Globe, RefreshCw, ExternalLink } from 'lucide-react';
import { SpeechUtils } from '../utils/speechUtils';

interface SpeechCompatibilityAlertProps {
  onClose?: () => void;
}

const SpeechCompatibilityAlert: React.FC<SpeechCompatibilityAlertProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{
    type: 'unsupported' | 'interaction';
    message: string;
    envInfo?: any;
  } | null>(null);

  useEffect(() => {
    const handleUnsupported = (event: CustomEvent) => {
      setAlertInfo({
        type: 'unsupported',
        message: event.detail.message,
        envInfo: event.detail.envInfo
      });
      setIsVisible(true);
    };

    const handleInteractionRequired = (event: CustomEvent) => {
      setAlertInfo({
        type: 'interaction',
        message: event.detail.message
      });
      setIsVisible(true);
    };

    window.addEventListener('speechUnsupported', handleUnsupported as EventListener);
    window.addEventListener('speechInteractionRequired', handleInteractionRequired as EventListener);

    return () => {
      window.removeEventListener('speechUnsupported', handleUnsupported as EventListener);
      window.removeEventListener('speechInteractionRequired', handleInteractionRequired as EventListener);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleActivateInteraction = () => {
    // 触发用户交互
    SpeechUtils.initUserInteraction();
    
    // 模拟点击事件来激活
    const clickEvent = new Event('click', { bubbles: true });
    document.dispatchEvent(clickEvent);
    
    handleClose();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleOpenInBrowser = () => {
    const currentUrl = window.location.href;
    // 尝试复制到剪贴板
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        alert('链接已复制到剪贴板！\n请在浏览器中粘贴打开。');
      }).catch(() => {
        alert(`请复制以下链接到浏览器中打开：\n${currentUrl}`);
      });
    } else {
      alert(`请复制以下链接到浏览器中打开：\n${currentUrl}`);
    }
  };

  if (!isVisible || !alertInfo) return null;

  const isUnsupported = alertInfo.type === 'unsupported';
  const envInfo = alertInfo.envInfo;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-700 shadow-2xl">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isUnsupported ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-yellow-500 to-orange-500'
            }`}>
              {isUnsupported ? (
                <AlertTriangle className="w-6 h-6 text-white" />
              ) : (
                <Smartphone className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isUnsupported ? '语音功能不支持' : '需要激活语音功能'}
              </h3>
              <p className="text-sm text-gray-400">
                {isUnsupported ? '浏览器兼容性问题' : '微信浏览器限制'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 内容 */}
        <div className="space-y-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {alertInfo.message}
            </p>
          </div>

          {/* 环境信息 */}
          {isUnsupported && envInfo && (
            <div className="bg-slate-700/30 rounded-lg p-3">
              <h4 className="text-white font-medium mb-2 text-sm">检测到的环境：</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">浏览器:</span>
                  <span className="text-white">
                    {envInfo.isWeChat ? '微信' : '其他'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">设备:</span>
                  <span className="text-white">
                    {envInfo.isMobile ? '移动端' : '桌面端'}
                  </span>
                </div>
                {envInfo.isWeChat && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">微信版本:</span>
                      <span className="text-white">
                        {envInfo.wechatVersion || '未知'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">小程序:</span>
                      <span className={envInfo.isWechatMiniProgram ? 'text-red-400' : 'text-green-400'}>
                        {envInfo.isWechatMiniProgram ? '是' : '否'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex flex-col space-y-2">
            {!isUnsupported ? (
              <button
                onClick={handleActivateInteraction}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>激活语音功能</span>
              </button>
            ) : (
              <>
                {envInfo?.isWeChat && (
                  <button
                    onClick={handleOpenInBrowser}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>在浏览器中打开</span>
                  </button>
                )}
                <button
                  onClick={handleRefresh}
                  className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>刷新页面</span>
                </button>
              </>
            )}
            
            <button
              onClick={handleClose}
              className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              我知道了
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechCompatibilityAlert;
