/**
 * 音频播放工具类
 * 用于播放本地音频文件
 */

export class AudioUtils {
  private static audioCache: Map<string, HTMLAudioElement> = new Map();

  /**
   * 播放音频文件
   * @param audioPath 音频文件路径（相对于public目录）
   * @param options 播放选项
   */
  static async playAudio(audioPath: string, options: {
    volume?: number;
    loop?: boolean;
    preload?: boolean;
  } = {}): Promise<boolean> {
    const {
      volume = 1.0,
      loop = false,
      preload = true
    } = options;

    try {
      let audio = this.audioCache.get(audioPath);
      
      if (!audio) {
        audio = new Audio(audioPath);
        if (preload) {
          this.audioCache.set(audioPath, audio);
        }
      }

      // 设置音频属性
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.loop = loop;

      // 重置播放位置
      audio.currentTime = 0;

      // 播放音频
      await audio.play();
      
      console.log(`🎵 音频播放成功: ${audioPath}`);
      return true;

    } catch (error) {
      console.error(`🔇 音频播放失败: ${audioPath}`, error);
      return false;
    }
  }

  /**
   * 播放成功音效
   */
  static async playSuccessSound(): Promise<boolean> {
    try {
      // 首先尝试播放音频文件
      const audioResult = await this.playAudio('/ok.mp3', {
        volume: 0.8,
        loop: false,
        preload: true
      });

      if (audioResult) {
        return true;
      }

      // 如果音频文件播放失败，使用Web Audio API生成成功音效
      console.log('音频文件播放失败，使用Web Audio API生成音效');
      return this.generateSuccessSound();

    } catch (error) {
      console.warn('播放成功音效失败，尝试生成音效:', error);
      return this.generateSuccessSound();
    }
  }

  /**
   * 使用Web Audio API生成成功音效
   */
  private static generateSuccessSound(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // 创建一个简单的成功音效（上升的音调）
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // 设置音效参数
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.exponentialRampToValueAtTime(783.99, audioContext.currentTime + 0.1); // G5
        oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioContext.currentTime + 0.2); // C6

        // 设置音量包络
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        // 播放音效
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);

        oscillator.onended = () => {
          audioContext.close();
          resolve(true);
        };

        console.log('🎵 生成成功音效播放完成');

      } catch (error) {
        console.error('生成音效失败:', error);
        resolve(false);
      }
    });
  }

  /**
   * 停止所有音频播放
   */
  static stopAllAudio(): void {
    this.audioCache.forEach((audio) => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }

  /**
   * 预加载音频文件
   * @param audioPaths 音频文件路径数组
   */
  static async preloadAudios(audioPaths: string[]): Promise<void> {
    const loadPromises = audioPaths.map(async (path) => {
      try {
        const audio = new Audio(path);
        audio.preload = 'auto';
        this.audioCache.set(path, audio);
        
        // 等待音频元数据加载完成
        return new Promise<void>((resolve, reject) => {
          audio.addEventListener('loadedmetadata', () => resolve());
          audio.addEventListener('error', reject);
        });
      } catch (error) {
        console.warn(`预加载音频失败: ${path}`, error);
      }
    });

    await Promise.allSettled(loadPromises);
    console.log('🎵 音频预加载完成');
  }

  /**
   * 清理音频缓存
   */
  static clearCache(): void {
    this.audioCache.clear();
    console.log('🗑️ 音频缓存已清理');
  }

  /**
   * 检查浏览器是否支持音频播放
   */
  static isAudioSupported(): boolean {
    return typeof Audio !== 'undefined';
  }

  /**
   * 获取音频支持的格式
   */
  static getSupportedFormats(): string[] {
    if (!this.isAudioSupported()) {
      return [];
    }

    const audio = new Audio();
    const formats: string[] = [];

    // 检查常见音频格式支持
    const testFormats = [
      { format: 'mp3', mime: 'audio/mpeg' },
      { format: 'wav', mime: 'audio/wav' },
      { format: 'ogg', mime: 'audio/ogg' },
      { format: 'aac', mime: 'audio/aac' },
      { format: 'm4a', mime: 'audio/mp4' }
    ];

    testFormats.forEach(({ format, mime }) => {
      if (audio.canPlayType(mime)) {
        formats.push(format);
      }
    });

    return formats;
  }
}

export default AudioUtils;
