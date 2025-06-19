import { useCallback } from 'react';
import { SpeechUtils } from '../utils/speechUtils';

interface SpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  showAlert?: boolean;
}

export const useSpeech = () => {
  const speak = useCallback(async (text: string, options: SpeechOptions = {}) => {
    const {
      lang = 'en-US',
      rate,
      pitch = 1,
      volume = 1,
      showAlert = true
    } = options;

    const envInfo = SpeechUtils.getEnvironmentInfo();
    
    // 微信浏览器特殊提示
    if (envInfo.isWeChat && !envInfo.userInteracted && showAlert) {
      alert('请先点击页面任意位置激活语音功能！');
      return false;
    }

    // 根据环境自动调整播放速度
    const adjustedRate = rate || (envInfo.isWeChat ? 0.7 : 0.8);

    try {
      const success = await SpeechUtils.speakText(text, {
        lang,
        rate: adjustedRate,
        pitch,
        volume
      });

      if (!success && showAlert && envInfo.isWeChat) {
        alert('语音播放失败！\n请确保：\n1. 已与页面交互\n2. 手机音量已开启\n3. 网络连接正常');
      }

      return success;
    } catch (error) {
      console.error('语音播放异常:', error);
      return false;
    }
  }, []);

  const getEnvironmentInfo = useCallback(() => {
    return SpeechUtils.getEnvironmentInfo();
  }, []);

  const isSupported = useCallback(() => {
    return SpeechUtils.isSpeechSupported();
  }, []);

  const stop = useCallback(() => {
    SpeechUtils.stopSpeech();
  }, []);

  const pause = useCallback(() => {
    SpeechUtils.pauseSpeech();
  }, []);

  const resume = useCallback(() => {
    SpeechUtils.resumeSpeech();
  }, []);

  const speakList = useCallback(async (textList: string[], options: SpeechOptions & { interval?: number } = {}) => {
    const {
      lang = 'en-US',
      rate,
      pitch = 1,
      volume = 1,
      interval = 1000,
      showAlert = true
    } = options;

    const envInfo = SpeechUtils.getEnvironmentInfo();

    // 微信浏览器特殊提示
    if (envInfo.isWeChat && !envInfo.userInteracted && showAlert) {
      alert('请先点击页面任意位置激活语音功能！');
      return [];
    }

    // 根据环境自动调整播放速度
    const adjustedRate = rate || (envInfo.isWeChat ? 0.7 : 0.8);

    try {
      const results = await SpeechUtils.speakTextList(textList, {
        lang,
        rate: adjustedRate,
        pitch,
        volume,
        interval
      });

      return results;
    } catch (error) {
      console.error('批量语音播放异常:', error);
      return textList.map(() => false);
    }
  }, []);

  const getVoices = useCallback(() => {
    return SpeechUtils.getVoices();
  }, []);

  const getRecommendedVoice = useCallback(() => {
    return SpeechUtils.getRecommendedEnglishVoice();
  }, []);

  const getStats = useCallback(() => {
    return SpeechUtils.getPlaybackStats();
  }, []);

  const reset = useCallback(async () => {
    await SpeechUtils.resetSpeechEngine();
  }, []);

  return {
    speak,
    speakList,
    getEnvironmentInfo,
    isSupported,
    stop,
    pause,
    resume,
    reset,
    getVoices,
    getRecommendedVoice,
    getStats
  };
};

export default useSpeech;
