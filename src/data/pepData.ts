// PEP一年级下册知识点数据
export interface WordItem {
  english: string;
  chinese: string;
  phonetic?: string;
}

export interface PhraseItem {
  english: string;
  chinese: string;
}

export interface SentenceItem {
  english: string;
  chinese: string;
}

export interface UnitData {
  id: number;
  title: string;
  subtitle: string;
  words: WordItem[];
  phrases: PhraseItem[];
  sentences: SentenceItem[];
}

export const pepUnits: UnitData[] = [
  {
    id: 1,
    title: "Unit 1",
    subtitle: "Nice boys and girls",
    words: [
      { english: "thank", chinese: "谢谢" },
      { english: "Mr", chinese: "(用于男子的姓氏或姓名前) 先生" },
      { english: "sorry", chinese: "歉疚;过意不去" },
      { english: "Miss", chinese: "(用于未婚女子的姓氏或姓名前) 女士,小姐" },
    ],
    phrases: [
      { english: "thank you", chinese: "谢谢你" },
    ],
    sentences: [
      { english: "You're welcome.", chinese: "不客气。不用谢。" },
      { english: "Excuse me.", chinese: "劳驾。" },
      { english: "I'm sorry.", chinese: "对不起。" },
      { english: "It's OK.", chinese: "没关系。" },
      { english: "Good morning.", chinese: "早上好。" },
      { english: "Good afternoon.", chinese: "下午好。" },
      { english: "Show me your book, please.", chinese: "请把你的书给我看看。" },
      { english: "Happy birthday!", chinese: "生日快乐！" },
      { english: "Here it is.", chinese: "在这。" },
      { english: "Say \"Thank you\".", chinese: "说\"谢谢你\"。" },
      { english: "Please.", chinese: "请" },
    ]
  },
  {
    id: 2,
    title: "Unit 2",
    subtitle: "Wash,brush,clean!",
    words: [
      { english: "wash", chinese: "洗;清洗" },
      { english: "hand", chinese: "手" },
      { english: "face", chinese: "脸;面部" },
      { english: "brush", chinese: "(用刷子)刷净,刷亮" },
      { english: "tooth (复数 teeth)", chinese: "牙齿" },
    ],
    phrases: [
      { english: "in the morning", chinese: "在早上" },
      { english: "in the evening", chinese: "在晚上" },
    ],
    sentences: [
      { english: "I wash my face.", chinese: "我洗脸。" },
      { english: "I brush my teeth.", chinese: "我刷牙。" },
      { english: "I wash my hands.", chinese: "我洗手。" },
      { english: "My face is clean.", chinese: "我的脸是干净的。" },
      { english: "My teeth are clean.", chinese: "我的牙齿是干净的。" },
      { english: "I am clean.", chinese: "我是干净的。" },
      { english: "I wash my face too.", chinese: "我也洗脸。" },
      { english: "I brush my teeth too.", chinese: "我也刷牙。" },
      { english: "I clean my body too.", chinese: "我也洗澡。" },
      { english: "We're both clean now!", chinese: "现在我们都是干净的。" },
    ]
  },
  {
    id: 3,
    title: "Unit 3",
    subtitle: "Eat well",
    words: [
      { english: "noodle (复数 noodles)", chinese: "面条" },
      { english: "tomato", chinese: "西红柿" },
      { english: "rice", chinese: "米饭;大米" },
      { english: "carrot", chinese: "胡萝卜" },
      { english: "apple", chinese: "苹果" },
      { english: "banana", chinese: "香蕉" },
    ],
    phrases: [
      { english: "a rice ball", chinese: "一个饭团" },
    ],
    sentences: [
      { english: "I like noodles and tomatoes.", chinese: "我喜欢(吃)面条和西红柿。" },
      { english: "I like bananas too!", chinese: "我也喜欢(吃)香蕉。" },
      { english: "I don't like carrots.", chinese: "我不喜欢(吃)胡萝卜。" },
      { english: "Oh, sorry.", chinese: "噢,对不起。" },
      { english: "But I love soup.", chinese: "但是我爱(喝)汤。" },
      { english: "I can try.", chinese: "我可以试一试。" },
      { english: "We don't have bananas.", chinese: "我们没有香蕉。" },
      { english: "It has rice, meat and carrots.", chinese: "它有米饭,肉和胡萝卜。" },
      { english: "Do you like it too?", chinese: "你也喜欢它吗?" },
      { english: "Yes. It's great!", chinese: "是的。很好吃！" },
    ]
  },
  {
    id: 4,
    title: "Unit 4",
    subtitle: "My pet",
    words: [
      { english: "dog", chinese: "狗" },
      { english: "bird", chinese: "鸟" },
      { english: "fish", chinese: "鱼" },
      { english: "rabbit", chinese: "兔" },
      { english: "cat", chinese: "猫" },
    ],
    phrases: [
      { english: "act like a dog", chinese: "模仿狗" },
    ],
    sentences: [
      { english: "Do you like birds?", chinese: "你喜欢鸟吗?" },
      { english: "Yes, I do.", chinese: "是的,我喜欢。" },
      { english: "No, I don't.", chinese: "不,我不喜欢。" },
      { english: "I don't like birds or fish.", chinese: "我不喜欢鸟和鱼。" },
      { english: "Let's get a cat.", chinese: "让我们买只猫吧。" },
      { english: "I like rabbits.", chinese: "我喜欢兔子。" },
      { english: "This is Xiaobai.", chinese: "这是小白。" },
      { english: "Let's make a salad.", chinese: "让我们做沙拉吧。" },
      { english: "We have carrots, bananas, fish and rice.", chinese: "我们有胡萝卜,香蕉,鱼和米饭。" },
    ]
  },
  {
    id: 5,
    title: "Unit 5",
    subtitle: "We are special!",
    words: [
      { english: "big", chinese: "大的" },
      { english: "swim", chinese: "游泳" },
      { english: "fly", chinese: "飞；飞翔" },
      { english: "small", chinese: "小的" },
      { english: "run", chinese: "跑;奔跑" },
    ],
    phrases: [
      { english: "run fast", chinese: "跑得快" },
    ],
    sentences: [
      { english: "The dog is big.", chinese: "这只狗很大。" },
      { english: "It can swim.", chinese: "它会游泳。" },
      { english: "Fly like a small bird.", chinese: "像小鸟一样飞。" },
      { english: "Swim like a small fish.", chinese: "像小鱼一样游泳。" },
      { english: "Run like a big cat.", chinese: "像大猫一样跑。" },
      { english: "Can you swim?", chinese: "你会游泳吗?" },
      { english: "Yes, I can.", chinese: "是的,我会。" },
      { english: "No, I can't.", chinese: "不,我不会。" },
      { english: "But you can run fast.", chinese: "但是你跑得快。" },
      { english: "Can Polly fly?", chinese: "Polly会飞吗?" },
      { english: "It can sing.", chinese: "它会唱歌。" },
      { english: "I'm big.", chinese: "我很大。" },
      { english: "I can swim well.", chinese: "我游泳游得很好。" },
      { english: "My bird is small.", chinese: "我的鸟很小。" },
      { english: "I'm a bird.", chinese: "我是一只鸟。" },
      { english: "But I can't fly.", chinese: "但是我不会飞。" },
      { english: "I can't talk.", chinese: "我不会说话。" },
      { english: "I can't read.", chinese: "我不会看书。" },
    ]
  }
];

// 获取所有单词
export const getAllWords = (): WordItem[] => {
  return pepUnits.flatMap(unit => unit.words);
};

// 获取所有短语
export const getAllPhrases = (): PhraseItem[] => {
  return pepUnits.flatMap(unit => unit.phrases);
};

// 获取所有句子
export const getAllSentences = (): SentenceItem[] => {
  return pepUnits.flatMap(unit => unit.sentences);
};

// 随机打乱数组
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};