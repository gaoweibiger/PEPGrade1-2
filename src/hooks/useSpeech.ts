import { useCallback } from 'react';
import { SpeechUtils } from '../utils/speechUtils';

interface SpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  showAlert?: boolean;
  enablePronunciationCorrection?: boolean;
  showCorrectionInfo?: boolean;
}

export const useSpeech = () => {
  const speak = useCallback(async (text: string, options: SpeechOptions = {}) => {
    const {
      lang = 'en-US',
      rate,
      pitch = 1,
      volume = 1,
      showAlert = true,
      enablePronunciationCorrection = true,
      showCorrectionInfo = false
    } = options;

    // 根据环境自动调整播放速度
    const envInfo = SpeechUtils.getEnvironmentInfo();
    const adjustedRate = rate || (envInfo.isWeChat ? 0.7 : 0.8);

    try {
      const success = await SpeechUtils.speakText(text, {
        lang,
        rate: adjustedRate,
        pitch,
        volume,
        enablePronunciationCorrection,
        showCorrectionInfo
      });

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

    // 根据环境自动调整播放速度
    const envInfo = SpeechUtils.getEnvironmentInfo();
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

  // 读音修正相关方法
  const previewPronunciationCorrection = useCallback((text: string) => {
    return SpeechUtils.previewPronunciationCorrection(text);
  }, []);

  const setPronunciationCorrectionEnabled = useCallback((enabled: boolean) => {
    SpeechUtils.setPronunciationCorrectionEnabled(enabled);
  }, []);

  const isPronunciationCorrectionEnabled = useCallback(() => {
    return SpeechUtils.isPronunciationCorrectionEnabled();
  }, []);

  const getSupportedAbbreviations = useCallback(() => {
    return SpeechUtils.getSupportedAbbreviations();
  }, []);

  const addCustomPronunciationRule = useCallback((original: string, corrected: string) => {
    SpeechUtils.addCustomPronunciationRule(original, corrected);
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
    getStats,
    // 读音修正功能
    previewPronunciationCorrection,
    setPronunciationCorrectionEnabled,
    isPronunciationCorrectionEnabled,
    getSupportedAbbreviations,
    addCustomPronunciationRule
  };
};

export default useSpeech;
