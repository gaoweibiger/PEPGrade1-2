import { PronunciationCorrector } from './pronunciationCorrector';

// 语音播放工具类 - 高性能优化版本
export class SpeechUtils {
  private static isWeChat = /MicroMessenger/i.test(navigator.userAgent);
  private static isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  private static isAndroid = /Android/i.test(navigator.userAgent);
  private static userInteracted = false;
  private static weChatAudioContext: AudioContext | null = null;

  // 性能优化相关
  private static isEngineWarmedUp = false;
  private static voicesCache: SpeechSynthesisVoice[] = [];
  private static voicesLoaded = false;
  private static preferredVoice: SpeechSynthesisVoice | null = null;
  private static warmupPromise: Promise<void> | null = null;

  // 读音修正相关
  private static pronunciationCorrectionEnabled = true;

  // 初始化用户交互监听 - 性能优化版本
  static initUserInteraction() {
    if (!this.userInteracted) {
      const events = ['touchstart', 'click', 'keydown', 'touchend'];
      const handleInteraction = () => {
        this.userInteracted = true;

        // 微信浏览器特殊处理：初始化 AudioContext
        if (this.isWeChat) {
          this.initWeChatAudio();
        }

        // 立即开始预热语音引擎
        this.warmupSpeechEngine();

        events.forEach(event => {
          document.removeEventListener(event, handleInteraction);
        });

        console.log('✅ 用户交互已激活，语音功能可用，开始预热引擎...');

        // 触发自定义事件通知其他组件
        window.dispatchEvent(new CustomEvent('userInteractionActivated', {
          detail: { timestamp: Date.now() }
        }));
      };

      events.forEach(event => {
        document.addEventListener(event, handleInteraction, { once: true });
      });

      console.log('🎯 用户交互监听器已设置，等待用户交互...');
    } else {
      console.log('✅ 用户交互已经激活');
    }
  }

  // 预热语音引擎 - 关键性能优化
  static async warmupSpeechEngine(): Promise<void> {
    if (this.warmupPromise) {
      return this.warmupPromise;
    }

    this.warmupPromise = this.performWarmup();
    return this.warmupPromise;
  }

  private static async performWarmup(): Promise<void> {
    if (this.isEngineWarmedUp || !this.isSpeechSupported()) {
      return;
    }

    try {
      console.log('🔥 开始预热语音引擎...');
      const startTime = performance.now();

      // 1. 预加载语音列表
      await this.loadVoices();

      // 2. 创建一个静音的测试语音来初始化引擎
      const testUtterance = new SpeechSynthesisUtterance(' ');
      testUtterance.volume = 0; // 静音
      testUtterance.rate = this.isWeChat ? 0.7 : 0.8;
      testUtterance.lang = 'en-US';

      if (this.preferredVoice) {
        testUtterance.voice = this.preferredVoice;
      }

      // 使用 Promise 来等待预热完成
      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          resolve(); // 即使超时也继续
        }, 500); // 最多等待500ms

        testUtterance.onstart = () => {
          clearTimeout(timeout);
          resolve();
        };

        testUtterance.onend = () => {
          clearTimeout(timeout);
          resolve();
        };

        testUtterance.onerror = () => {
          clearTimeout(timeout);
          resolve(); // 即使出错也继续
        };

        speechSynthesis.speak(testUtterance);
      });

      this.isEngineWarmedUp = true;
      const endTime = performance.now();
      console.log(`✅ 语音引擎预热完成，耗时: ${Math.round(endTime - startTime)}ms`);

    } catch (error) {
      console.warn('语音引擎预热失败:', error);
      // 即使预热失败，也标记为已尝试，避免重复预热
      this.isEngineWarmedUp = true;
    }
  }

  // 异步加载语音列表
  private static async loadVoices(): Promise<void> {
    if (this.voicesLoaded) {
      return;
    }

    return new Promise<void>((resolve) => {
      const loadVoicesWithTimeout = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          this.voicesCache = voices;
          this.preferredVoice = this.findBestVoice(voices);
          this.voicesLoaded = true;
          console.log(`📢 加载了 ${voices.length} 个语音，首选: ${this.preferredVoice?.name || '默认'}`);
          resolve();
        } else {
          // 如果语音列表为空，等待一下再试
          setTimeout(() => {
            const retryVoices = speechSynthesis.getVoices();
            this.voicesCache = retryVoices;
            this.preferredVoice = this.findBestVoice(retryVoices);
            this.voicesLoaded = true;
            resolve();
          }, 100);
        }
      };

      // 监听语音列表变化事件
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoicesWithTimeout;
      }

      // 立即尝试加载
      loadVoicesWithTimeout();

      // 设置超时，避免无限等待
      setTimeout(() => {
        if (!this.voicesLoaded) {
          this.voicesCache = speechSynthesis.getVoices();
          this.preferredVoice = this.findBestVoice(this.voicesCache);
          this.voicesLoaded = true;
          resolve();
        }
      }, 1000);
    });
  }

  // 找到最佳语音
  private static findBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    if (voices.length === 0) return null;

    // 优先级：本地英语语音 > 在线英语语音 > 其他语音
    const englishVoices = voices.filter(voice => voice.lang.startsWith('en-'));

    if (englishVoices.length > 0) {
      // 优先选择本地语音
      const localEnglishVoices = englishVoices.filter(voice => voice.localService);
      if (localEnglishVoices.length > 0) {
        // 优先选择美式英语
        const usVoice = localEnglishVoices.find(voice => voice.lang === 'en-US');
        return usVoice || localEnglishVoices[0];
      }

      // 如果没有本地语音，选择在线语音
      const usVoice = englishVoices.find(voice => voice.lang === 'en-US');
      return usVoice || englishVoices[0];
    }

    return voices[0];
  }

  // 手动激活用户交互（用于调试和测试）
  static activateUserInteraction() {
    if (!this.userInteracted) {
      this.userInteracted = true;

      // 微信浏览器特殊处理：初始化 AudioContext
      if (this.isWeChat) {
        this.initWeChatAudio();
      }

      // 立即开始预热语音引擎
      this.warmupSpeechEngine();

      console.log('🔧 用户交互已手动激活（调试模式）');

      // 触发自定义事件通知其他组件
      window.dispatchEvent(new CustomEvent('userInteractionActivated', {
        detail: { timestamp: Date.now(), manual: true }
      }));

      return true;
    }

    console.log('✅ 用户交互已经激活');
    return false;
  }

  // 初始化微信音频上下文 - 增强版本
  private static async initWeChatAudio() {
    try {
      console.log('🔧 开始初始化微信音频上下文...');

      // 创建音频上下文
      if (!this.weChatAudioContext) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          this.weChatAudioContext = new AudioContext();
          console.log('✅ 微信音频上下文创建成功');
        }
      }

      // 激活音频上下文
      if (this.weChatAudioContext && this.weChatAudioContext.state === 'suspended') {
        await this.weChatAudioContext.resume();
        console.log('✅ 微信音频上下文已恢复');
      }

      // 微信特殊处理：创建一个静音音频来"解锁"音频功能
      if (this.weChatAudioContext) {
        const oscillator = this.weChatAudioContext.createOscillator();
        const gainNode = this.weChatAudioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.weChatAudioContext.destination);

        gainNode.gain.value = 0; // 静音
        oscillator.frequency.value = 440;
        oscillator.start();
        oscillator.stop(this.weChatAudioContext.currentTime + 0.01);

        console.log('✅ 微信音频解锁完成');
      }

      console.log('✅ 微信音频上下文初始化完成');
    } catch (error) {
      console.warn('❌ 微信音频上下文初始化失败:', error);
    }
  }

  // 检查语音支持 - 微信环境增强检测
  static isSpeechSupported(): boolean {
    // 基础检查
    if (!('speechSynthesis' in window)) {
      console.warn('浏览器不支持 speechSynthesis API');
      return false;
    }

    // 检查是否在微信小程序环境中（这个确实不支持）
    if (window.__wxjs_environment === 'miniprogram') {
      console.warn('微信小程序环境不支持 Web Speech API');
      return false;
    }

    // 检查 SpeechSynthesisUtterance 是否可用
    if (!('SpeechSynthesisUtterance' in window)) {
      console.warn('浏览器不支持 SpeechSynthesisUtterance API');

      // 如果是微信环境，给出特殊提示
      if (this.isWeChat) {
        console.warn('微信浏览器版本可能过低，不支持语音合成功能');
        console.warn('建议：1. 更新微信到最新版本 2. 复制链接到其他浏览器打开');
      }

      return false;
    }

    // 尝试创建 SpeechSynthesisUtterance 实例来验证
    try {
      const testUtterance = new SpeechSynthesisUtterance('test');

      // 移动端额外检查：尝试获取语音列表
      if (this.isMobileDevice()) {
        // 移动端可能需要时间加载语音列表，所以我们更宽松
        console.log('移动端设备检测到，语音API检查通过');
        return true;
      }

      return true;
    } catch (error) {
      console.warn('语音合成 API 不可用:', error);

      // 如果是微信环境，给出特殊提示
      if (this.isWeChat) {
        console.warn('微信浏览器语音功能异常，建议复制链接到其他浏览器打开');
      }

      return false;
    }
  }

  // 检测是否为移动设备
  static isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // 检测是否为桌面设备
  static isDesktopDevice(): boolean {
    return !this.isMobileDevice();
  }

  // 获取环境信息 - 增强版本
  static getEnvironmentInfo() {
    const speechSupported = this.isSpeechSupported();
    const wechatInfo = this.getWeChatInfo();

    return {
      isWeChat: this.isWeChat,
      isIOS: this.isIOS,
      isAndroid: this.isAndroid,
      isMobile: this.isMobileDevice(),
      isDesktop: this.isDesktopDevice(),
      userInteracted: this.userInteracted,
      speechSupported,
      wechatVersion: wechatInfo.version,
      wechatVersionSupported: wechatInfo.supported,
      isWechatMiniProgram: wechatInfo.isMiniProgram,
      supportLevel: this.getSupportLevel()
    };
  }

  // 获取微信相关信息 - 移动端优化
  static getWeChatInfo() {
    if (!this.isWeChat) {
      return { version: null, supported: false, isMiniProgram: false };
    }

    const userAgent = navigator.userAgent;
    const wechatVersionMatch = userAgent.match(/MicroMessenger\/(\d+)\.(\d+)\.(\d+)/);
    const isMiniProgram = window.__wxjs_environment === 'miniprogram';

    if (wechatVersionMatch) {
      const version = `${wechatVersionMatch[1]}.${wechatVersionMatch[2]}.${wechatVersionMatch[3]}`;
      const majorVersion = parseInt(wechatVersionMatch[1]);

      // 放宽版本要求：微信6.0+就支持，只要不是小程序
      const supported = majorVersion >= 6 && !isMiniProgram;

      return { version, supported, isMiniProgram };
    }

    // 如果无法检测版本，但不是小程序，就假设支持
    return { version: 'unknown', supported: !isMiniProgram, isMiniProgram };
  }

  // 获取支持级别 - 移动端优化
  static getSupportLevel(): 'full' | 'limited' | 'none' {
    if (!this.isSpeechSupported()) {
      return 'none';
    }

    // 移动端设备通常支持语音合成，但可能有限制
    if (this.isMobileDevice()) {
      if (this.isWeChat) {
        // 微信浏览器：只要不是小程序就支持
        if (window.__wxjs_environment === 'miniprogram') {
          return 'none';
        }
        return 'limited'; // 微信浏览器支持有限，需要用户交互
      }

      // 其他移动浏览器：Safari、Chrome Mobile等
      return 'limited'; // 移动端通常需要用户交互
    }

    // 桌面端浏览器
    return 'full';
  }

  // 高性能语音播放函数 - 零延迟优化 + 读音修正
  static async speakText(text: string, options?: {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    enablePronunciationCorrection?: boolean;
    showCorrectionInfo?: boolean;
  }): Promise<boolean> {
    const {
      enablePronunciationCorrection = this.pronunciationCorrectionEnabled,
      showCorrectionInfo = false,
      ...speechOptions
    } = options || {};

    console.log(`🎵 开始播放语音: "${text}"`);

    // 读音修正处理
    let processedText = text;
    if (enablePronunciationCorrection && text) {
      const originalText = text;
      processedText = PronunciationCorrector.quickCorrect(text);

      if (processedText !== originalText) {
        console.log(`📝 读音修正: "${originalText}" → "${processedText}"`);

        if (showCorrectionInfo) {
          // 显示修正信息给用户
          const corrections = PronunciationCorrector.previewCorrections(originalText);
          if (corrections.length > 0) {
            console.log('🔧 应用的读音修正:', corrections);

            // 触发自定义事件通知UI组件
            window.dispatchEvent(new CustomEvent('pronunciationCorrected', {
              detail: {
                original: originalText,
                corrected: processedText,
                corrections: corrections
              }
            }));
          }
        }
      }
    }

    const supportLevel = this.getSupportLevel();
    const envInfo = this.getEnvironmentInfo();

    console.log('环境信息:', {
      supportLevel,
      isWeChat: this.isWeChat,
      userInteracted: this.userInteracted,
      speechSupported: this.isSpeechSupported(),
      isEngineWarmedUp: this.isEngineWarmedUp,
      pronunciationCorrectionEnabled: enablePronunciationCorrection
    });

    if (supportLevel === 'none') {
      console.warn('当前环境不支持语音合成');
      this.showUnsupportedMessage();
      return false;
    }

    // 移动端和微信浏览器需要用户交互
    if ((this.isMobileDevice() || this.isWeChat) && !this.userInteracted) {
      console.warn('移动端/微信浏览器需要用户先与页面交互才能播放语音');
      this.showInteractionRequiredMessage();
      return false;
    }

    try {
      // 确保引擎已预热（非阻塞）
      if (!this.isEngineWarmedUp && this.userInteracted) {
        console.log('🔥 开始后台预热语音引擎...');
        this.warmupSpeechEngine(); // 不等待，让预热在后台进行
      }

      // 使用修正后的文本进行播放
      const result = await this.performFastSpeak(processedText, speechOptions);
      console.log(`🎵 语音播放结果: ${result ? '成功' : '失败'}`);
      return result;

    } catch (error) {
      console.error('语音播放异常:', error);
      return false;
    }
  }

  // 快速播放实现 - 微信优化版本
  private static async performFastSpeak(text: string, options?: {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    retryCount?: number;
  }): Promise<boolean> {
    const retryCount = options?.retryCount || 0;
    const maxRetries = this.isWeChat ? 2 : 1; // 微信多重试一次

    return new Promise(async (resolve) => {
      // 微信特殊处理：确保音频上下文已激活
      if (this.isWeChat && this.weChatAudioContext) {
        try {
          if (this.weChatAudioContext.state === 'suspended') {
            await this.weChatAudioContext.resume();
            console.log('🔧 微信音频上下文已恢复');
          }
        } catch (error) {
          console.warn('微信音频上下文恢复失败:', error);
        }
      }

      // 立即停止当前播放，无延迟
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // 使用缓存的最佳语音
      if (this.preferredVoice) {
        utterance.voice = this.preferredVoice;
      }

      // 优化的参数设置 - 微信特殊优化
      utterance.lang = options?.lang || 'en-US';

      // 微信8.0+版本需要特殊的参数设置
      if (this.isWeChat) {
        const wechatInfo = this.getWeChatInfo();
        const majorVersion = parseInt(wechatInfo.version?.split('.')[0] || '0');

        if (majorVersion >= 8) {
          // 微信8.0+使用更保守的设置
          utterance.rate = options?.rate || 0.7;
          utterance.volume = options?.volume || 0.9;
          utterance.pitch = options?.pitch || 0.9;
        } else {
          // 微信7.x及以下
          utterance.rate = options?.rate || 0.8;
          utterance.volume = options?.volume || 1;
          utterance.pitch = options?.pitch || 1;
        }
      } else {
        // 非微信浏览器
        utterance.rate = options?.rate || 0.9;
        utterance.volume = options?.volume || 1;
        utterance.pitch = options?.pitch || 1;
      }

      let hasStarted = false;
      let hasEnded = false;

      // 快速超时机制 - 减少等待时间
      const timeout = setTimeout(() => {
        if (!hasStarted && !hasEnded) {
          console.warn('语音播放启动超时');
          hasEnded = true;
          resolve(false);
        }
      }, 2000); // 增加到2秒超时，给语音引擎更多时间

      utterance.onstart = () => {
        hasStarted = true;
        clearTimeout(timeout);
        console.log('🎵 语音播放开始');
      };

      utterance.onend = () => {
        if (!hasEnded) {
          hasEnded = true;
          clearTimeout(timeout);
          console.log('✅ 语音播放完成');
          resolve(true);
        }
      };

      utterance.onerror = (event) => {
        if (!hasEnded) {
          hasEnded = true;
          clearTimeout(timeout);
          console.error('❌ 语音播放错误:', event.error);

          // 对于 synthesis-failed 错误，尝试重试（但有次数限制）
          if (event.error === 'synthesis-failed' && retryCount < maxRetries) {
            console.log(`检测到 synthesis-failed，尝试重试 (${retryCount + 1}/${maxRetries})...`);

            // 递归调用自己进行重试，但增加重试计数
            setTimeout(async () => {
              try {
                const retryResult = await this.performFastSpeak(text, {
                  ...options,
                  retryCount: retryCount + 1,
                  rate: (options?.rate || (this.isWeChat ? 0.8 : 0.9)) * 0.9, // 稍微降低速度
                  volume: (options?.volume || 1) * 0.9 // 稍微降低音量
                });
                resolve(retryResult);
              } catch (retryError) {
                console.error('重试过程中发生异常:', retryError);
                resolve(false);
              }
            }, 200);
          } else {
            if (retryCount >= maxRetries) {
              console.error(`❌ 已达到最大重试次数 (${maxRetries})，放弃播放`);
            }
            resolve(false);
          }
        }
      };

      // 立即播放，无延迟
      try {
        speechSynthesis.speak(utterance);
      } catch (error) {
        clearTimeout(timeout);
        console.error('语音播放启动失败:', error);
        resolve(false);
      }
    });
  }

  // 显示不支持的消息 - 微信环境增强
  static showUnsupportedMessage() {
    const envInfo = this.getEnvironmentInfo();
    let message = '抱歉，您的设备不支持语音合成功能。\n\n';

    if (envInfo.isWechatMiniProgram) {
      message += '检测到您在微信小程序中访问，小程序环境不支持网页语音功能。\n\n建议：\n• 在微信中直接打开链接\n• 或复制链接到其他浏览器打开';
    } else if (envInfo.isMobile) {
      if (envInfo.isWeChat) {
        // 检查是否是API不支持的问题
        const hasSpeechSynthesis = 'speechSynthesis' in window;
        const hasSpeechSynthesisUtterance = 'SpeechSynthesisUtterance' in window;

        if (!hasSpeechSynthesis || !hasSpeechSynthesisUtterance) {
          message += `微信浏览器版本不支持语音合成API。\n\n当前微信版本：${envInfo.wechatVersion || '未知'}\n\n解决方案：\n• 更新微信到最新版本\n• 复制链接到 Safari 浏览器打开\n• 复制链接到 Chrome 浏览器打开\n• 在手机设置中检查微信权限`;
        } else {
          message += '微信浏览器语音功能检测。\n\n请尝试：\n• 点击页面任意位置激活音频\n• 确保设备音量已开启\n• 检查网络连接\n• 或复制链接到 Safari/Chrome 打开';
        }
      } else {
        message += '移动端浏览器语音功能检测。\n\n请尝试：\n• 点击页面任意位置激活音频\n• 确保设备音量已开启\n• 使用 Safari (iOS) 或 Chrome (Android)\n• 检查浏览器权限设置';
      }
    } else {
      message += '桌面端浏览器不支持。\n\n建议使用：\n• Chrome (推荐)\n• Safari\n• Edge\n• Firefox 最新版本';
    }

    // 在控制台输出详细信息
    console.warn('语音功能不支持详情:', envInfo);
    console.warn('speechSynthesis支持:', 'speechSynthesis' in window);
    console.warn('SpeechSynthesisUtterance支持:', 'SpeechSynthesisUtterance' in window);

    // 可以通过自定义事件通知UI组件
    window.dispatchEvent(new CustomEvent('speechUnsupported', {
      detail: { message, envInfo }
    }));
  }

  // 显示需要交互的消息 - 移动端优化
  static showInteractionRequiredMessage() {
    const envInfo = this.getEnvironmentInfo();
    let message = '请先点击页面任意位置激活语音功能！\n\n';

    if (envInfo.isWeChat) {
      message += '这是微信浏览器的安全限制，需要用户交互后才能播放语音。';
    } else if (envInfo.isMobile) {
      message += '这是移动端浏览器的安全限制，需要用户交互后才能播放音频。\n\n提示：\n• 确保设备音量已开启\n• 检查浏览器音频权限';
    } else {
      message += '浏览器需要用户交互后才能播放音频。';
    }

    window.dispatchEvent(new CustomEvent('speechInteractionRequired', {
      detail: { message, envInfo }
    }));
  }

  // 获取可用语音列表 - 使用缓存
  static getVoices(): SpeechSynthesisVoice[] {
    if (this.voicesLoaded && this.voicesCache.length > 0) {
      return this.voicesCache;
    }

    // 如果缓存为空，尝试重新加载
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      this.voicesCache = voices;
      this.voicesLoaded = true;
    }

    return voices;
  }

  // 获取推荐的英语语音 - 使用缓存
  static getRecommendedEnglishVoice(): SpeechSynthesisVoice | null {
    if (this.preferredVoice) {
      return this.preferredVoice;
    }

    const voices = this.getVoices();
    this.preferredVoice = this.findBestVoice(voices);
    return this.preferredVoice;
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



  // 高性能批量播放文本列表
  static async speakTextList(textList: string[], options?: {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    interval?: number; // 播放间隔（毫秒）
  }): Promise<boolean[]> {
    const results: boolean[] = [];
    const interval = options?.interval || 500; // 减少默认间隔

    // 确保引擎已预热
    if (!this.isEngineWarmedUp && this.userInteracted) {
      await this.warmupSpeechEngine();
    }

    for (let i = 0; i < textList.length; i++) {
      const text = textList[i];
      console.log(`🎵 播放第 ${i + 1}/${textList.length} 个: ${text}`);

      const success = await this.speakText(text, options);
      results.push(success);

      // 如果不是最后一个，等待间隔时间
      if (i < textList.length - 1) {
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }

    console.log(`📊 批量播放完成，成功率: ${results.filter(r => r).length}/${results.length}`);
    return results;
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
      recommendedVoice: this.getRecommendedEnglishVoice()?.name || 'None',
      isEngineWarmedUp: this.isEngineWarmedUp,
      voicesLoaded: this.voicesLoaded,
      pronunciationCorrectionEnabled: this.pronunciationCorrectionEnabled
    };
  }

  // 读音修正相关方法

  /**
   * 启用/禁用读音修正功能
   */
  static setPronunciationCorrectionEnabled(enabled: boolean): void {
    this.pronunciationCorrectionEnabled = enabled;
    console.log(`📝 读音修正功能已${enabled ? '启用' : '禁用'}`);
  }

  /**
   * 获取读音修正状态
   */
  static isPronunciationCorrectionEnabled(): boolean {
    return this.pronunciationCorrectionEnabled;
  }

  /**
   * 预览文本的读音修正效果
   */
  static previewPronunciationCorrection(text: string): {
    original: string;
    corrected: string;
    corrections: Array<{
      position: number;
      original: string;
      corrected: string;
      type: string;
    }>;
    needsCorrection: boolean;
  } {
    const corrected = PronunciationCorrector.quickCorrect(text);
    const corrections = PronunciationCorrector.previewCorrections(text);
    const needsCorrection = PronunciationCorrector.needsCorrection(text);

    return {
      original: text,
      corrected,
      corrections,
      needsCorrection
    };
  }

  /**
   * 添加自定义读音修正规则
   */
  static addCustomPronunciationRule(original: string, corrected: string): void {
    PronunciationCorrector.addCustomAbbreviation(original, corrected);
    console.log(`📝 添加自定义读音规则: "${original}" → "${corrected}"`);
  }

  /**
   * 获取所有支持的缩写词
   */
  static getSupportedAbbreviations(): Array<{abbreviation: string, expansion: string}> {
    return PronunciationCorrector.getSupportedAbbreviations();
  }

  /**
   * 批量播放文本列表 - 支持读音修正
   */
  static async speakTextListWithCorrection(textList: string[], options?: {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    interval?: number;
    enablePronunciationCorrection?: boolean;
    showCorrectionInfo?: boolean;
  }): Promise<boolean[]> {
    const results: boolean[] = [];
    const interval = options?.interval || 500;

    // 确保引擎已预热
    if (!this.isEngineWarmedUp && this.userInteracted) {
      await this.warmupSpeechEngine();
    }

    for (let i = 0; i < textList.length; i++) {
      const text = textList[i];
      console.log(`🎵 播放第 ${i + 1}/${textList.length} 个: ${text}`);

      const success = await this.speakText(text, options);
      results.push(success);

      // 如果不是最后一个，等待间隔时间
      if (i < textList.length - 1) {
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }

    console.log(`📊 批量播放完成，成功率: ${results.filter(r => r).length}/${results.length}`);
    return results;
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

export const activateUserInteraction = () => SpeechUtils.activateUserInteraction();

// 在全局对象上暴露调试函数
if (typeof window !== 'undefined') {
  (window as any).SpeechUtils = SpeechUtils;
  (window as any).activateUserInteraction = activateUserInteraction;
}