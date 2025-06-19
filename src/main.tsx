import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SpeechUtils } from './utils/speechUtils';

// 初始化语音功能
SpeechUtils.initUserInteraction();

// 页面加载完成后，如果用户已经交互过，立即开始预热
document.addEventListener('DOMContentLoaded', () => {
  // 延迟一点时间，让页面完全加载
  setTimeout(() => {
    const envInfo = SpeechUtils.getEnvironmentInfo();
    if (envInfo.userInteracted && envInfo.speechSupported) {
      console.log('🚀 页面加载完成，开始预热语音引擎...');
      SpeechUtils.warmupSpeechEngine();
    }
  }, 1000);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);