import React, { useState } from 'react';
import { Volume2, ArrowLeft } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface VocabularySectionProps {
  onBack: () => void;
}

const vocabularyCategories = {
  animals: {
    title: '动物 Animals',
    color: 'bg-green-500',
    items: [
      { word: 'Cat', chinese: '猫', emoji: '🐱' },
      { word: 'Dog', chinese: '狗', emoji: '🐶' },
      { word: 'Bird', chinese: '鸟', emoji: '🐦' },
      { word: 'Fish', chinese: '鱼', emoji: '🐟' },
      { word: 'Rabbit', chinese: '兔子', emoji: '🐰' },
      { word: 'Elephant', chinese: '大象', emoji: '🐘' },
    ]
  },
  food: {
    title: '食物 Food',
    color: 'bg-red-500',
    items: [
      { word: 'Apple', chinese: '苹果', emoji: '🍎' },
      { word: 'Banana', chinese: '香蕉', emoji: '🍌' },
      { word: 'Orange', chinese: '橙子', emoji: '🍊' },
      { word: 'Bread', chinese: '面包', emoji: '🍞' },
      { word: 'Milk', chinese: '牛奶', emoji: '🥛' },
      { word: 'Cake', chinese: '蛋糕', emoji: '🎂' },
    ]
  },
  family: {
    title: '家庭 Family',
    color: 'bg-blue-500',
    items: [
      { word: 'Mom', chinese: '妈妈', emoji: '👩' },
      { word: 'Dad', chinese: '爸爸', emoji: '👨' },
      { word: 'Baby', chinese: '宝宝', emoji: '👶' },
      { word: 'Sister', chinese: '姐妹', emoji: '👧' },
      { word: 'Brother', chinese: '兄弟', emoji: '👦' },
      { word: 'Family', chinese: '家庭', emoji: '👨‍👩‍👧‍👦' },
    ]
  }
};

const VocabularySection: React.FC<VocabularySectionProps> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<any>(null);
  const { speak } = useSpeech();

  if (selectedWord) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setSelectedWord(null)}
              className="flex items-center space-x-2 bg-white rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">返回</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center">
              <div className="text-8xl mb-6">{selectedWord.emoji}</div>
              
              <h3 className="text-4xl font-bold text-gray-800 mb-2">
                {selectedWord.word}
              </h3>
              
              <div className="text-xl text-gray-600 mb-6">
                {selectedWord.chinese}
              </div>

              <button
                onClick={() => speak(selectedWord.word)}
                className="flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl transition-colors mx-auto"
              >
                <Volume2 className="w-5 h-5" />
                <span>听发音</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    const category = vocabularyCategories[selectedCategory as keyof typeof vocabularyCategories];
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center space-x-2 bg-white rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">返回</span>
            </button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">{category.title}</h2>
            <p className="text-lg text-gray-600">点击单词来听发音！</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {category.items.map((item) => (
              <button
                key={item.word}
                onClick={() => setSelectedWord(item)}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{item.emoji}</div>
                  <div className="text-xl font-bold text-gray-800 mb-1">{item.word}</div>
                  <div className="text-sm text-gray-600">{item.chinese}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 bg-white rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">返回</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">学单词 Vocabulary</h2>
          <p className="text-lg text-gray-600">选择一个类别开始学习！</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(vocabularyCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`${category.color} text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{category.items[0].emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                <div className="text-white/90">
                  {category.items.length} 个单词
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VocabularySection;