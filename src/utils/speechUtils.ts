// 语音播放工具类 - 针对微信浏览器优化
export class SpeechUtils {
  private static isWeChat = /MicroMessenger/i.test(navigator.userAgent);
  private static isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  private static isAndroid = /Android/i.test(navigator.userAgent);
  private static userInteracted = false;
  private static weChatAudioContext: AudioContext | null = null;

  // 初始化用户交互监听
  static initUserInteraction() {
    if (!this.userInteracted) {
      const events = ['touchstart', 'click', 'keydown', 'touchend'];
      const handleInteraction = () => {
        this.userInteracted = true;

        // 微信浏览器特殊处理：初始化 AudioContext
        if (this.isWeChat) {
          this.initWeChatAudio();
        }

        events.forEach(event => {
          document.removeEventListener(event, handleInteraction);
        });

        console.log('用户交互已激活，语音功能可用');
      };

      events.forEach(event => {
        document.addEventListener(event, handleInteraction, { once: true });
      });
    }
  }

  // 初始化微信音频上下文
  private static initWeChatAudio() {
    try {
      if (!this.weChatAudioContext) {
        this.weChatAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // 激活音频上下文
      if (this.weChatAudioContext.state === 'suspended') {
        this.weChatAudioContext.resume();
      }
    } catch (error) {
      console.warn('微信音频上下文初始化失败:', error);
    }
  }

  // 检查语音支持
  static isSpeechSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  // 检测是否为移动设备
  static isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // 检测是否为桌面设备
  static isDesktopDevice(): boolean {
    return !this.isMobileDevice();
  }

  // 获取环境信息
  static getEnvironmentInfo() {
    return {
      isWeChat: this.isWeChat,
      isIOS: this.isIOS,
      isAndroid: this.isAndroid,
      isMobile: this.isMobileDevice(),
      isDesktop: this.isDesktopDevice(),
      userInteracted: this.userInteracted,
      speechSupported: this.isSpeechSupported()
    };
  }

  // 优化的语音播放函数
  static speakText(text: string, options?: {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
  }): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.isSpeechSupported()) {
        console.warn('当前浏览器不支持语音合成');
        resolve(false);
        return;
      }

      // 微信浏览器需要用户交互
      if (this.isWeChat && !this.userInteracted) {
        console.warn('微信浏览器需要用户先与页面交互才能播放语音');
        resolve(false);
        return;
      }

      try {
        // 先停止当前播放
        speechSynthesis.cancel();

        // 微信浏览器特殊处理
        if (this.isWeChat) {
          this.speakInWeChat(text, options, resolve);
        } else {
          this.speakNormal(text, options, resolve);
        }

      } catch (error) {
        console.error('语音播放异常:', error);
        resolve(false);
      }
    });
  }

  // 微信浏览器语音播放
  private static speakInWeChat(text: string, options: any, resolve: (value: boolean) => void) {
    // 确保语音合成器处于干净状态
    speechSynthesis.cancel();

    // 等待一小段时间确保取消完成
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);

      // 微信浏览器优化设置
      utterance.lang = options?.lang || 'en-US';
      utterance.rate = Math.max(0.5, Math.min(1.0, options?.rate || 0.7)); // 限制速度范围
      utterance.pitch = Math.max(0.5, Math.min(2.0, options?.pitch || 1)); // 限制音调范围
      utterance.volume = Math.max(0.1, Math.min(1.0, options?.volume || 1)); // 限制音量范围

      let hasStarted = false;
      let hasEnded = false;
      let timeoutId: NodeJS.Timeout;

      utterance.onstart = () => {
        hasStarted = true;
        console.log('微信语音播放开始');
        if (timeoutId) clearTimeout(timeoutId);
      };

      utterance.onend = () => {
        if (!hasEnded) {
          hasEnded = true;
          console.log('微信语音播放结束');
          if (timeoutId) clearTimeout(timeoutId);
          resolve(true);
        }
      };

      utterance.onerror = (event) => {
        if (!hasEnded) {
          hasEnded = true;
          console.error('微信语音播放错误:', event.error);
          if (timeoutId) clearTimeout(timeoutId);

          // 对于 synthesis-failed 错误，尝试重新播放
          if (event.error === 'synthesis-failed') {
            console.log('检测到 synthesis-failed，尝试重新播放...');
            setTimeout(() => {
              speechSynthesis.cancel();
              setTimeout(() => {
                speechSynthesis.speak(utterance);
              }, 100);
            }, 500);
          } else {
            resolve(false);
          }
        }
      };

      // 微信浏览器多重保障
      try {
        speechSynthesis.speak(utterance);

        // 设置超时检测
        timeoutId = setTimeout(() => {
          if (!hasStarted && !hasEnded) {
            console.warn('微信语音播放超时，尝试重新播放');
            speechSynthesis.cancel();
            setTimeout(() => {
              speechSynthesis.speak(utterance);
            }, 100);
          }
        }, 2000); // 增加超时时间到2秒

      } catch (error) {
        console.error('微信语音播放异常:', error);
        resolve(false);
      }
    }, 100); // 等待100ms确保之前的播放已取消
  }

  // 普通浏览器语音播放
  private static speakNormal(text: string, options: any, resolve: (value: boolean) => void) {
    // 确保语音合成器处于干净状态
    speechSynthesis.cancel();

    // 等待一小段时间确保取消完成
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);

      // 参数验证和限制
      utterance.lang = options?.lang || 'en-US';
      utterance.rate = Math.max(0.5, Math.min(2.0, options?.rate || 0.8));
      utterance.pitch = Math.max(0.5, Math.min(2.0, options?.pitch || 1));
      utterance.volume = Math.max(0.1, Math.min(1.0, options?.volume || 1));

      let hasEnded = false;

      utterance.onstart = () => {
        console.log('语音播放开始');
      };

      utterance.onend = () => {
        if (!hasEnded) {
          hasEnded = true;
          console.log('语音播放结束');
          resolve(true);
        }
      };

      utterance.onerror = (event) => {
        if (!hasEnded) {
          hasEnded = true;
          console.error('语音播放错误:', event.error);

          // 对于 synthesis-failed 错误，尝试重新播放
          if (event.error === 'synthesis-failed') {
            console.log('检测到 synthesis-failed，尝试重新播放...');
            setTimeout(() => {
              speechSynthesis.cancel();
              setTimeout(() => {
                const retryUtterance = new SpeechSynthesisUtterance(text);
                retryUtterance.lang = utterance.lang;
                retryUtterance.rate = utterance.rate;
                retryUtterance.pitch = utterance.pitch;
                retryUtterance.volume = utterance.volume;

                retryUtterance.onend = () => resolve(true);
                retryUtterance.onerror = () => resolve(false);

                speechSynthesis.speak(retryUtterance);
              }, 100);
            }, 300);
          } else {
            resolve(false);
          }
        }
      };

      try {
        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('语音播放异常:', error);
        resolve(false);
      }
    }, 50); // 等待50ms确保之前的播放已取消
  }

  // 停止语音播放
  static stopSpeech() {
    if (this.isSpeechSupported()) {
      speechSynthesis.cancel();
    }
  }

  // 暂停语音播放
  static pauseSpeech() {
    if (this.isSpeechSupported()) {
      speechSynthesis.pause();
    }
  }

  // 恢复语音播放
  static resumeSpeech() {
    if (this.isSpeechSupported()) {
      speechSynthesis.resume();
    }
  }

  // 重置语音引擎
  static async resetSpeechEngine(): Promise<void> {
    if (this.isSpeechSupported()) {
      try {
        // 取消所有当前播放
        speechSynthesis.cancel();

        // 等待一段时间让引擎完全重置
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            // 尝试获取语音列表来"唤醒"引擎
            const voices = speechSynthesis.getVoices();
            console.log('语音引擎重置完成，可用语音数量:', voices.length);
            resolve();
          }, 300);
        });
      } catch (error) {
        console.error('重置语音引擎失败:', error);
      }
    }
  }

  // 获取可用语音列表
  static getVoices(): SpeechSynthesisVoice[] {
    if (this.isSpeechSupported()) {
      return speechSynthesis.getVoices();
    }
    return [];
  }

  // 批量播放文本列表
  static async speakTextList(textList: string[], options?: {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    interval?: number; // 播放间隔（毫秒）
  }): Promise<boolean[]> {
    const results: boolean[] = [];
    const interval = options?.interval || 1000;

    for (let i = 0; i < textList.length; i++) {
      const text = textList[i];
      console.log(`播放第 ${i + 1}/${textList.length} 个: ${text}`);

      const success = await this.speakText(text, options);
      results.push(success);

      // 如果不是最后一个，等待间隔时间
      if (i < textList.length - 1) {
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }

    return results;
  }

  // 获取推荐的英语语音
  static getRecommendedEnglishVoice(): SpeechSynthesisVoice | null {
    const voices = this.getVoices();

    // 优先选择英语语音
    const englishVoices = voices.filter(voice =>
      voice.lang.startsWith('en-') && !voice.name.includes('Google')
    );

    if (englishVoices.length > 0) {
      // 优先选择美式英语
      const usVoice = englishVoices.find(voice => voice.lang === 'en-US');
      return usVoice || englishVoices[0];
    }

    return voices.length > 0 ? voices[0] : null;
  }

  // 智能语音测试 - 更准确的测试结果
  static async testSpeech(text: string = 'Hello, this is a test!'): Promise<{
    success: boolean;
    message: string;
    details: string;
  }> {
    if (!this.isSpeechSupported()) {
      return {
        success: false,
        message: '浏览器不支持语音合成功能',
        details: '请使用支持 Web Speech API 的现代浏览器'
      };
    }

    if (this.isWeChat && !this.userInteracted) {
      return {
        success: false,
        message: '需要先与页面交互',
        details: '请点击页面任意位置激活语音功能'
      };
    }

    try {
      // 创建测试语音
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = this.isWeChat ? 0.7 : 0.8;
      utterance.volume = 1;

      let speechStarted = false;
      let speechEnded = false;

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          if (!speechStarted) {
            resolve({
              success: false,
              message: '语音播放启动超时',
              details: '可能是设备音量关闭或浏览器限制'
            });
          } else if (!speechEnded) {
            resolve({
              success: true,
              message: '语音播放已开始',
              details: '如果听不到声音，请检查设备音量设置'
            });
          }
        }, 3000);

        utterance.onstart = () => {
          speechStarted = true;
          console.log('语音播放开始');
        };

        utterance.onend = () => {
          speechEnded = true;
          clearTimeout(timeout);
          resolve({
            success: true,
            message: '语音播放成功',
            details: '语音功能工作正常'
          });
        };

        utterance.onerror = async (event) => {
          clearTimeout(timeout);

          // 对 synthesis-failed 错误进行特殊处理
          if (event.error === 'synthesis-failed') {
            console.log('检测到 synthesis-failed 错误，尝试重置语音引擎...');

            try {
              // 重置语音引擎
              await this.resetSpeechEngine();

              // 重新尝试播放
              const retryUtterance = new SpeechSynthesisUtterance(text);
              retryUtterance.lang = 'en-US';
              retryUtterance.rate = this.isWeChat ? 0.6 : 0.7; // 使用更慢的速度
              retryUtterance.volume = 0.8; // 稍微降低音量

              retryUtterance.onend = () => {
                resolve({
                  success: true,
                  message: '语音播放成功（重试后）',
                  details: '语音引擎已重置并重新播放'
                });
              };

              retryUtterance.onerror = (retryEvent) => {
                resolve({
                  success: false,
                  message: '语音播放失败',
                  details: `重试后仍然失败: ${retryEvent.error}`
                });
              };

              speechSynthesis.speak(retryUtterance);

            } catch (resetError) {
              resolve({
                success: false,
                message: '语音引擎重置失败',
                details: `无法恢复语音功能: ${event.error}`
              });
            }
          } else {
            resolve({
              success: false,
              message: '语音播放出错',
              details: `错误类型: ${event.error}`
            });
          }
        };

        // 开始播放
        speechSynthesis.cancel(); // 先取消之前的播放
        speechSynthesis.speak(utterance);
      });

    } catch (error) {
      return {
        success: false,
        message: '语音测试异常',
        details: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 语音播放统计
  static getPlaybackStats() {
    return {
      isSupported: this.isSpeechSupported(),
      environment: this.getEnvironmentInfo(),
      availableVoices: this.getVoices().length,
      recommendedVoice: this.getRecommendedEnglishVoice()?.name || 'None'
    };
  }
}

// 导出便捷函数
export const speakText = (text: string, options?: {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}) => SpeechUtils.speakText(text, options);

export const initSpeech = () => SpeechUtils.initUserInteraction();