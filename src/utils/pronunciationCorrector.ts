// 语音读音修正器 - 处理缩写词、特殊读音等
export class PronunciationCorrector {
  // 缩写词映射表
  private static abbreviationMap: Record<string, string> = {
    // 称谓缩写
    'Mr': 'Mister',
    'Mr.': 'Mister',
    'Mrs': 'Missus',
    'Mrs.': 'Missus',
    'Ms': 'Miss',
    'Ms.': 'Miss',
    'Dr': 'Doctor',
    'Dr.': 'Doctor',
    'Prof': 'Professor',
    'Prof.': 'Professor',
    
    // 常见缩写
    'etc': 'et cetera',
    'etc.': 'et cetera',
    'vs': 'versus',
    'vs.': 'versus',
    'e.g.': 'for example',
    'i.e.': 'that is',
    'a.m.': 'ay em',
    'p.m.': 'pee em',
    'AM': 'ay em',
    'PM': 'pee em',
    
    // 单位缩写
    'kg': 'kilogram',
    'km': 'kilometer',
    'cm': 'centimeter',
    'mm': 'millimeter',
    'lb': 'pound',
    'oz': 'ounce',
    'ft': 'feet',
    'in': 'inch',
    
    // 月份缩写
    'Jan': 'January',
    'Feb': 'February',
    'Mar': 'March',
    'Apr': 'April',
    'Jun': 'June',
    'Jul': 'July',
    'Aug': 'August',
    'Sep': 'September',
    'Sept': 'September',
    'Oct': 'October',
    'Nov': 'November',
    'Dec': 'December',
    
    // 星期缩写
    'Mon': 'Monday',
    'Tue': 'Tuesday',
    'Wed': 'Wednesday',
    'Thu': 'Thursday',
    'Fri': 'Friday',
    'Sat': 'Saturday',
    'Sun': 'Sunday',
    
    // 国家/地区缩写
    'US': 'United States',
    'USA': 'United States of America',
    'UK': 'United Kingdom',
    'EU': 'European Union',
    'UN': 'United Nations',
    'NYC': 'New York City',
    'LA': 'Los Angeles',
    'SF': 'San Francisco',
    
    // 技术缩写
    'IT': 'I T',
    'AI': 'A I',
    'UI': 'U I',
    'API': 'A P I',
    'URL': 'U R L',
    'HTML': 'H T M L',
    'CSS': 'C S S',
    'JS': 'JavaScript',
    'SQL': 'S Q L',
    'XML': 'X M L',
    'JSON': 'J S O N',
    'HTTP': 'H T T P',
    'HTTPS': 'H T T P S',
    'FTP': 'F T P',
    'SSH': 'S S H',
    'VPN': 'V P N',
    'DNS': 'D N S',
    'IP': 'I P',
    'TCP': 'T C P',
    'UDP': 'U D P',
    'WiFi': 'Wi-Fi',
    'GPS': 'G P S',
    'USB': 'U S B',
    'CPU': 'C P U',
    'GPU': 'G P U',
    'RAM': 'R A M',
    'ROM': 'R O M',
    'SSD': 'S S D',
    'HDD': 'H D D',
    'DVD': 'D V D',
    'CD': 'C D',
    'TV': 'T V',
    'PC': 'P C',
    'Mac': 'Mac',
    'iOS': 'I O S',
    'OS': 'O S',
    'App': 'App',
    
    // 学术/教育缩写
    'PhD': 'P H D',
    'BA': 'B A',
    'BS': 'B S',
    'MA': 'M A',
    'MS': 'M S',
    'MBA': 'M B A',
    'GPA': 'G P A',
    'SAT': 'S A T',
    'ACT': 'A C T',
    'TOEFL': 'T O E F L',
    'IELTS': 'I E L T S',
    
    // 商业/金融缩写
    'CEO': 'C E O',
    'CFO': 'C F O',
    'CTO': 'C T O',
    'HR': 'H R',
    'PR': 'P R',
    'R&D': 'R and D',
    'LLC': 'L L C',
    'Inc': 'Incorporated',
    'Inc.': 'Incorporated',
    'Corp': 'Corporation',
    'Corp.': 'Corporation',
    'Ltd': 'Limited',
    'Ltd.': 'Limited',
    'Co': 'Company',
    'Co.': 'Company',
    'ATM': 'A T M',
    'PIN': 'P I N',
    'ID': 'I D',
    'SSN': 'S S N',
    'IRS': 'I R S',
    'FBI': 'F B I',
    'CIA': 'C I A',
    'NASA': 'N A S A',
    'WHO': 'W H O',
    'NATO': 'N A T O',
    'GDP': 'G D P',
    'IPO': 'I P O',
    'NYSE': 'N Y S E',
    'NASDAQ': 'N A S D A Q'
  };

  // 特殊读音映射表
  private static specialPronunciationMap: Record<string, string> = {
    // 数字序号
    '1st': 'first',
    '2nd': 'second',
    '3rd': 'third',
    '4th': 'fourth',
    '5th': 'fifth',
    '6th': 'sixth',
    '7th': 'seventh',
    '8th': 'eighth',
    '9th': 'ninth',
    '10th': 'tenth',
    '11th': 'eleventh',
    '12th': 'twelfth',
    '13th': 'thirteenth',
    '14th': 'fourteenth',
    '15th': 'fifteenth',
    '16th': 'sixteenth',
    '17th': 'seventeenth',
    '18th': 'eighteenth',
    '19th': 'nineteenth',
    '20th': 'twentieth',
    '21st': 'twenty first',
    '22nd': 'twenty second',
    '23rd': 'twenty third',
    '30th': 'thirtieth',
    '31st': 'thirty first',

    // 特殊符号和表达
    '&': 'and',
    '@': 'at',
    '#': 'hash',
    '%': 'percent',
    '$': 'dollar',
    '€': 'euro',
    '£': 'pound',
    '¥': 'yen',
    '+': 'plus',
    '-': 'minus',
    '=': 'equals',
    '×': 'times',
    '÷': 'divided by',

    // 常见网络用语
    'LOL': 'L O L',
    'OMG': 'O M G',
    'BRB': 'B R B',
    'ASAP': 'A S A P',
    'FAQ': 'F A Q',
    'DIY': 'D I Y',
    'FYI': 'F Y I',
    'RSVP': 'R S V P',
    'PS': 'P S',
    'PPS': 'P P S',
    'CC': 'C C',
    'BCC': 'B C C',

    // 时间表达
    "o'clock": 'o clock',
    "12:00": 'twelve o clock',
    "1:00": 'one o clock',
    "2:00": 'two o clock',
    "3:00": 'three o clock',
    "4:00": 'four o clock',
    "5:00": 'five o clock',
    "6:00": 'six o clock',
    "7:00": 'seven o clock',
    "8:00": 'eight o clock',
    "9:00": 'nine o clock',
    "10:00": 'ten o clock',
    "11:00": 'eleven o clock'
  };

  // 连读修正映射表 - 处理常见的英语连读问题
  // 使用逗号来创建短暂停顿，避免连读
  private static linkingMap: Record<string, string> = {
    // the + 元音开头的单词连读修正 - 在中间插入短暂停顿
    'the evening': 'the, evening',
    'the apple': 'the, apple',
    'the orange': 'the, orange',
    'the elephant': 'the, elephant',
    'the umbrella': 'the, umbrella',
    'the ice': 'the, ice',
    'the egg': 'the, egg',
    'the ant': 'the, ant',
    'the owl': 'the, owl',
    'the end': 'the, end',
    'the answer': 'the, answer',
    'the idea': 'the, idea',
    'the office': 'the, office',
    'the ocean': 'the, ocean',
    'the earth': 'the, earth',
    'the air': 'the, air',
    'the arm': 'the, arm',
    'the eye': 'the, eye',
    'the ear': 'the, ear',

    // in + the + 元音开头的单词连读修正
    'in the evening': 'in the, evening',
    'in the afternoon': 'in the, afternoon',
    'in the morning': 'in the, morning',
    'in the air': 'in the, air',
    'in the end': 'in the, end',
    'in the office': 'in the, office',

    // an + 元音开头的单词连读修正 - 在中间插入短暂停顿
    'an apple': 'an, apple',
    'an orange': 'an, orange',
    'an elephant': 'an, elephant',
    'an umbrella': 'an, umbrella',
    'an ice cream': 'an, ice cream',
    'an egg': 'an, egg',
    'an ant': 'an, ant',
    'an owl': 'an, owl',
    'an idea': 'an, idea',
    'an office': 'an, office',
    'an ocean': 'an, ocean',
    'an ear': 'an, ear',
    'an eye': 'an, eye',
    'an arm': 'an, arm',

    // 辅音结尾 + are 连读修正
    'teeth are': 'teeth, are',
    'hands are': 'hands, are',
    'books are': 'books, are',
    'cats are': 'cats, are',
    'dogs are': 'dogs, are',
    'birds are': 'birds, are',
    'fish are': 'fish, are',
    'eyes are': 'eyes, are',
    'ears are': 'ears, are',
    'arms are': 'arms, are',

    // 动词 + it 连读修正 - 使用更自然的分隔方法
    'like it': 'like itt',
    'love it': 'love itt',
    'want it': 'want itt',
    'need it': 'need itt',
    'get it': 'get itt',
    'take it': 'take itt',
    'make it': 'make itt',
    'have it': 'have itt',
    'see it': 'see itt',
    'do it': 'do itt',
    'try it': 'try itt',
    'buy it': 'buy itt',
    'use it': 'use itt',
    'find it': 'find itt',
    'keep it': 'keep itt',
    'put it': 'put itt',
    'give it': 'give itt',
    'show it': 'show itt',
    'know it': 'know itt',
    'think it': 'think itt',

    // 其他常见连读修正
    'at eight': 'at, eight',
    'at eleven': 'at, eleven',
    'at all': 'at, all',
    'at once': 'at, once',
    'for example': 'for, example',
    'for each': 'for, each',
    'of all': 'of, all',
    'of each': 'of, each',
    'with us': 'with, us',
    'with each': 'with, each',
    'on earth': 'on, earth',
    'on each': 'on, each'
  };

  // 字母拼读映射表
  private static letterMap: Record<string, string> = {
    'A': 'ay', 'B': 'bee', 'C': 'see', 'D': 'dee', 'E': 'ee',
    'F': 'eff', 'G': 'gee', 'H': 'aitch', 'I': 'eye', 'J': 'jay',
    'K': 'kay', 'L': 'ell', 'M': 'em', 'N': 'en', 'O': 'oh',
    'P': 'pee', 'Q': 'cue', 'R': 'ar', 'S': 'ess', 'T': 'tee',
    'U': 'you', 'V': 'vee', 'W': 'double you', 'X': 'ex', 'Y': 'why', 'Z': 'zee'
  };

  // 数字读音映射表
  private static numberMap: Record<string, string> = {
    '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
    '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine',
    '10': 'ten', '11': 'eleven', '12': 'twelve', '13': 'thirteen', '14': 'fourteen',
    '15': 'fifteen', '16': 'sixteen', '17': 'seventeen', '18': 'eighteen', '19': 'nineteen',
    '20': 'twenty', '30': 'thirty', '40': 'forty', '50': 'fifty',
    '60': 'sixty', '70': 'seventy', '80': 'eighty', '90': 'ninety',
    '100': 'one hundred', '1000': 'one thousand', '1000000': 'one million'
  };

  /**
   * 主要的文本修正方法
   */
  static correctPronunciation(text: string, options: {
    enableAbbreviations?: boolean;
    enableSpecialPronunciation?: boolean;
    enableLetterSpelling?: boolean;
    enableNumberConversion?: boolean;
    enableLinkingCorrection?: boolean;
    preserveCase?: boolean;
    debugMode?: boolean;
  } = {}): string {
    const {
      enableAbbreviations = true,
      enableSpecialPronunciation = true,
      enableLetterSpelling = true,
      enableNumberConversion = true,
      enableLinkingCorrection = true,
      preserveCase = false,
      debugMode = false
    } = options;

    if (!text || typeof text !== 'string') {
      return text;
    }

    let correctedText = text;
    const corrections: Array<{type: string, original: string, corrected: string}> = [];

    if (debugMode) {
      console.log(`🔧 开始修正文本: "${text}"`);
    }

    // 1. 处理连读修正（优先处理，避免被其他规则干扰）
    if (enableLinkingCorrection) {
      correctedText = this.correctLinking(correctedText, corrections, debugMode);
    }

    // 2. 处理缩写词
    if (enableAbbreviations) {
      correctedText = this.correctAbbreviations(correctedText, corrections, debugMode);
    }

    // 3. 处理特殊读音
    if (enableSpecialPronunciation) {
      correctedText = this.correctSpecialPronunciation(correctedText, corrections, debugMode);
    }

    // 4. 处理单个字母
    if (enableLetterSpelling) {
      correctedText = this.correctLetterSpelling(correctedText, corrections, debugMode);
    }

    // 5. 处理数字
    if (enableNumberConversion) {
      correctedText = this.correctNumbers(correctedText, corrections, debugMode);
    }

    // 6. 清理多余的空格
    correctedText = correctedText.replace(/\s+/g, ' ').trim();

    if (debugMode && corrections.length > 0) {
      console.log('📝 应用的修正:', corrections);
      console.log(`✅ 修正结果: "${correctedText}"`);
    }

    return correctedText;
  }

  /**
   * 修正连读问题
   */
  private static correctLinking(text: string, corrections: any[], debugMode: boolean): string {
    let result = text;

    // 处理预定义的连读修正
    for (const [original, corrected] of Object.entries(this.linkingMap)) {
      const regex = new RegExp(this.escapeRegExp(original), 'gi');
      const matches = result.match(regex);

      if (matches) {
        result = result.replace(regex, corrected);

        if (debugMode) {
          corrections.push({
            type: 'linking_correction',
            original: original,
            corrected: corrected
          });
        }
      }
    }

    // 通用连读规则：the + 元音开头的单词 (使用逗号创建停顿)
    result = result.replace(/\bthe\s+([aeiouAEIOU]\w*)/gi, (match, word) => {
      // 检查是否已经被预定义规则处理过
      const alreadyProcessed = Object.keys(this.linkingMap).some(key =>
        key.toLowerCase().includes(match.toLowerCase())
      );

      if (!alreadyProcessed) {
        const corrected = `the, ${word}`;
        if (debugMode) {
          corrections.push({
            type: 'linking_correction',
            original: match,
            corrected: corrected
          });
        }
        return corrected;
      }
      return match;
    });

    // 处理 "in the" + 元音开头的单词的特殊情况
    result = result.replace(/\bin\s+the\s+([aeiouAEIOU]\w*)/gi, (match, word) => {
      // 检查是否已经被预定义规则处理过
      const alreadyProcessed = Object.keys(this.linkingMap).some(key =>
        key.toLowerCase().includes(match.toLowerCase())
      );

      if (!alreadyProcessed) {
        const corrected = `in the, ${word}`;
        if (debugMode) {
          corrections.push({
            type: 'linking_correction',
            original: match,
            corrected: corrected
          });
        }
        return corrected;
      }
      return match;
    });

    // 通用连读规则：辅音结尾的单词 + are (避免连读)
    result = result.replace(/\b(\w*[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ])\s+are\b/gi, (match, word) => {
      // 检查是否已经被预定义规则处理过
      const alreadyProcessed = Object.keys(this.linkingMap).some(key =>
        key.toLowerCase().includes(match.toLowerCase())
      );

      if (!alreadyProcessed) {
        const corrected = `${word}, are`;
        if (debugMode) {
          corrections.push({
            type: 'linking_correction',
            original: match,
            corrected: corrected
          });
        }
        return corrected;
      }
      return match;
    });

    // 通用连读规则：动词 + it (避免连读导致发音不清)
    result = result.replace(/\b(\w+)\s+it\b/gi, (match, verb) => {
      // 检查是否已经被预定义规则处理过
      const alreadyProcessed = Object.keys(this.linkingMap).some(key =>
        key.toLowerCase().includes(match.toLowerCase())
      );

      // 只处理常见动词，避免误处理其他词性
      const commonVerbs = [
        'like', 'love', 'want', 'need', 'get', 'take', 'make', 'have', 'see', 'do',
        'try', 'buy', 'use', 'find', 'keep', 'put', 'give', 'show', 'know', 'think',
        'eat', 'drink', 'read', 'write', 'watch', 'play', 'hear', 'feel', 'touch',
        'smell', 'taste', 'hold', 'carry', 'bring', 'send', 'tell', 'say', 'call',
        'ask', 'answer', 'help', 'teach', 'learn', 'study', 'work', 'build', 'fix',
        'clean', 'wash', 'cook', 'cut', 'open', 'close', 'start', 'stop', 'finish'
      ];

      if (!alreadyProcessed && commonVerbs.includes(verb.toLowerCase())) {
        const corrected = `${verb} itt`;
        if (debugMode) {
          corrections.push({
            type: 'linking_correction',
            original: match,
            corrected: corrected
          });
        }
        return corrected;
      }
      return match;
    });

    return result;
  }

  /**
   * 修正缩写词
   */
  private static correctAbbreviations(text: string, corrections: any[], debugMode: boolean): string {
    let result = text;

    // 使用正则表达式匹配单词边界，确保精确匹配
    for (const [abbrev, expansion] of Object.entries(this.abbreviationMap)) {
      const regex = new RegExp(`\\b${this.escapeRegExp(abbrev)}\\b`, 'gi');
      const matches = result.match(regex);

      if (matches) {
        result = result.replace(regex, expansion);

        if (debugMode) {
          corrections.push({
            type: 'abbreviation',
            original: abbrev,
            corrected: expansion
          });
        }
      }
    }

    return result;
  }

  /**
   * 修正特殊读音
   */
  private static correctSpecialPronunciation(text: string, corrections: any[], debugMode: boolean): string {
    let result = text;

    for (const [original, corrected] of Object.entries(this.specialPronunciationMap)) {
      const regex = new RegExp(`\\b${this.escapeRegExp(original)}\\b`, 'gi');
      const matches = result.match(regex);

      if (matches) {
        result = result.replace(regex, corrected);

        if (debugMode) {
          corrections.push({
            type: 'special_pronunciation',
            original: original,
            corrected: corrected
          });
        }
      }
    }

    return result;
  }

  /**
   * 修正单个字母的读音
   */
  private static correctLetterSpelling(text: string, corrections: any[], debugMode: boolean): string {
    let result = text;

    // 匹配独立的单个字母（前后有空格或标点符号）
    const letterRegex = /\b([A-Z])\b/g;

    result = result.replace(letterRegex, (match, letter) => {
      const spelling = this.letterMap[letter.toUpperCase()];
      if (spelling) {
        if (debugMode) {
          corrections.push({
            type: 'letter_spelling',
            original: letter,
            corrected: spelling
          });
        }
        return spelling;
      }
      return match;
    });

    return result;
  }

  /**
   * 修正数字读音
   */
  private static correctNumbers(text: string, corrections: any[], debugMode: boolean): string {
    let result = text;

    // 处理简单的数字（0-100）
    for (const [number, word] of Object.entries(this.numberMap)) {
      const regex = new RegExp(`\\b${number}\\b`, 'g');
      const matches = result.match(regex);

      if (matches) {
        result = result.replace(regex, word);

        if (debugMode) {
          corrections.push({
            type: 'number_conversion',
            original: number,
            corrected: word
          });
        }
      }
    }

    // 处理复杂数字（21-99）
    result = result.replace(/\b([2-9])([1-9])\b/g, (match, tens, ones) => {
      const tensWord = this.numberMap[tens + '0'];
      const onesWord = this.numberMap[ones];

      if (tensWord && onesWord) {
        const corrected = `${tensWord} ${onesWord}`;

        if (debugMode) {
          corrections.push({
            type: 'number_conversion',
            original: match,
            corrected: corrected
          });
        }

        return corrected;
      }

      return match;
    });

    return result;
  }

  /**
   * 转义正则表达式特殊字符
   */
  private static escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * 快速修正常见缩写词（主要用于教学场景）
   */
  static quickCorrect(text: string): string {
    return this.correctPronunciation(text, {
      enableAbbreviations: true,
      enableSpecialPronunciation: true,
      enableLetterSpelling: false, // 在教学中通常不需要拼读单个字母
      enableNumberConversion: true,
      enableLinkingCorrection: true, // 启用连读修正
      preserveCase: false,
      debugMode: false
    });
  }

  /**
   * 检查文本是否需要修正
   */
  static needsCorrection(text: string): boolean {
    if (!text || typeof text !== 'string') {
      return false;
    }

    // 检查是否包含连读问题
    for (const linkingPhrase of Object.keys(this.linkingMap)) {
      if (text.toLowerCase().includes(linkingPhrase.toLowerCase())) {
        return true;
      }
    }

    // 检查通用连读模式：the + 元音开头的单词
    if (/\bthe\s+[aeiouAEIOU]\w*/i.test(text)) {
      return true;
    }

    // 检查通用连读模式：in the + 元音开头的单词
    if (/\bin\s+the\s+[aeiouAEIOU]\w*/i.test(text)) {
      return true;
    }

    // 检查通用连读模式：辅音结尾的单词 + are
    if (/\b\w*[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]\s+are\b/i.test(text)) {
      return true;
    }

    // 检查是否包含缩写词
    for (const abbrev of Object.keys(this.abbreviationMap)) {
      const regex = new RegExp(`\\b${this.escapeRegExp(abbrev)}\\b`, 'i');
      if (regex.test(text)) {
        return true;
      }
    }

    // 检查是否包含特殊读音词
    for (const word of Object.keys(this.specialPronunciationMap)) {
      const regex = new RegExp(`\\b${this.escapeRegExp(word)}\\b`, 'i');
      if (regex.test(text)) {
        return true;
      }
    }

    // 检查是否包含独立的字母
    if (/\b[A-Z]\b/.test(text)) {
      return true;
    }

    // 检查是否包含数字
    if (/\b\d+\b/.test(text)) {
      return true;
    }

    return false;
  }

  /**
   * 获取所有支持的缩写词列表
   */
  static getSupportedAbbreviations(): Array<{abbreviation: string, expansion: string}> {
    return Object.entries(this.abbreviationMap).map(([abbrev, expansion]) => ({
      abbreviation: abbrev,
      expansion: expansion
    }));
  }

  /**
   * 添加自定义缩写词
   */
  static addCustomAbbreviation(abbreviation: string, expansion: string): void {
    this.abbreviationMap[abbreviation] = expansion;
  }

  /**
   * 移除缩写词
   */
  static removeAbbreviation(abbreviation: string): void {
    delete this.abbreviationMap[abbreviation];
  }

  /**
   * 预览修正效果（不实际修改，只显示会发生的变化）
   */
  static previewCorrections(text: string): Array<{
    position: number;
    original: string;
    corrected: string;
    type: string;
  }> {
    const previews: Array<{
      position: number;
      original: string;
      corrected: string;
      type: string;
    }> = [];

    // 检查连读修正
    for (const [original, corrected] of Object.entries(this.linkingMap)) {
      const regex = new RegExp(this.escapeRegExp(original), 'gi');
      let match;

      while ((match = regex.exec(text)) !== null) {
        previews.push({
          position: match.index,
          original: match[0],
          corrected: corrected,
          type: 'linking_correction'
        });
      }
    }

    // 检查通用连读：the + 元音开头的单词
    const theVowelRegex = /\bthe\s+([aeiouAEIOU]\w*)/gi;
    let theMatch;
    while ((theMatch = theVowelRegex.exec(text)) !== null) {
      // 检查是否已经被预定义规则处理过
      const alreadyProcessed = Object.keys(this.linkingMap).some(key =>
        key.toLowerCase().includes(theMatch[0].toLowerCase())
      );

      if (!alreadyProcessed) {
        previews.push({
          position: theMatch.index,
          original: theMatch[0],
          corrected: `the, ${theMatch[1]}`,
          type: 'linking_correction'
        });
      }
    }

    // 检查 "in the" + 元音开头的单词的特殊情况
    const inTheVowelRegex = /\bin\s+the\s+([aeiouAEIOU]\w*)/gi;
    let inTheMatch;
    while ((inTheMatch = inTheVowelRegex.exec(text)) !== null) {
      // 检查是否已经被预定义规则处理过
      const alreadyProcessed = Object.keys(this.linkingMap).some(key =>
        key.toLowerCase().includes(inTheMatch[0].toLowerCase())
      );

      if (!alreadyProcessed) {
        previews.push({
          position: inTheMatch.index,
          original: inTheMatch[0],
          corrected: `in the, ${inTheMatch[1]}`,
          type: 'linking_correction'
        });
      }
    }

    // 检查辅音结尾 + are 连读
    const consonantAreRegex = /\b(\w*[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ])\s+are\b/gi;
    let consonantAreMatch;
    while ((consonantAreMatch = consonantAreRegex.exec(text)) !== null) {
      // 检查是否已经被预定义规则处理过
      const alreadyProcessed = Object.keys(this.linkingMap).some(key =>
        key.toLowerCase().includes(consonantAreMatch[0].toLowerCase())
      );

      if (!alreadyProcessed) {
        previews.push({
          position: consonantAreMatch.index,
          original: consonantAreMatch[0],
          corrected: `${consonantAreMatch[1]}, are`,
          type: 'linking_correction'
        });
      }
    }

    // 检查缩写词
    for (const [abbrev, expansion] of Object.entries(this.abbreviationMap)) {
      const regex = new RegExp(`\\b${this.escapeRegExp(abbrev)}\\b`, 'gi');
      let match;

      while ((match = regex.exec(text)) !== null) {
        previews.push({
          position: match.index,
          original: match[0],
          corrected: expansion,
          type: 'abbreviation'
        });
      }
    }

    // 检查特殊读音
    for (const [original, corrected] of Object.entries(this.specialPronunciationMap)) {
      const regex = new RegExp(`\\b${this.escapeRegExp(original)}\\b`, 'gi');
      let match;

      while ((match = regex.exec(text)) !== null) {
        previews.push({
          position: match.index,
          original: match[0],
          corrected: corrected,
          type: 'special_pronunciation'
        });
      }
    }

    // 按位置排序
    return previews.sort((a, b) => a.position - b.position);
  }
}

// 导出便捷函数
export const correctPronunciation = (text: string) => PronunciationCorrector.quickCorrect(text);
export const needsPronunciationCorrection = (text: string) => PronunciationCorrector.needsCorrection(text);
export const previewPronunciationCorrections = (text: string) => PronunciationCorrector.previewCorrections(text);
