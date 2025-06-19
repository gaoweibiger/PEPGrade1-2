import React, { useState } from 'react';
import { Volume2, ArrowLeft } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface NumbersSectionProps {
  onBack: () => void;
}

const numbersData = [
  { number: 1, word: 'One', emoji: '1️⃣', dots: '•' },
  { number: 2, word: 'Two', emoji: '2️⃣', dots: '••' },
  { number: 3, word: 'Three', emoji: '3️⃣', dots: '•••' },
  { number: 4, word: 'Four', emoji: '4️⃣', dots: '••••' },
  { number: 5, word: 'Five', emoji: '5️⃣', dots: '•••••' },
  { number: 6, word: 'Six', emoji: '6️⃣', dots: '••••••' },
  { number: 7, word: 'Seven', emoji: '7️⃣', dots: '•••••••' },
  { number: 8, word: 'Eight', emoji: '8️⃣', dots: '••••••••' },
  { number: 9, word: 'Nine', emoji: '9️⃣', dots: '•••••••••' },
  { number: 10, word: 'Ten', emoji: '🔟', dots: '••••••••••' },
];

const NumbersSection: React.FC<NumbersSectionProps> = ({ onBack }) => {
  const [selectedNumber, setSelectedNumber] = useState<typeof numbersData[0] | null>(null);
  const { speak } = useSpeech();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
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

        {!selectedNumber ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">学数字 123</h2>
              <p className="text-lg text-gray-600">点击数字来学习发音和计数！</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {numbersData.map((item) => (
                <button
                  key={item.number}
                  onClick={() => setSelectedNumber(item)}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
                >
                  <div className="text-center">
                    <div className="text-6xl font-bold text-orange-600 mb-2 group-hover:text-orange-700">
                      {item.number}
                    </div>
                    <div className="text-2xl mb-2">{item.emoji}</div>
                    <div className="text-sm font-medium text-gray-600">{item.word}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-8xl font-bold text-orange-600 mb-4">
                {selectedNumber.number}
              </div>
              
              <div className="text-6xl mb-6">{selectedNumber.emoji}</div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                {selectedNumber.word}
              </h3>
              
              <div className="text-2xl text-blue-600 mb-6 font-mono">
                {selectedNumber.dots}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <button
                  onClick={() => speak(selectedNumber.number.toString())}
                  className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>听数字</span>
                </button>

                <button
                  onClick={() => speak(selectedNumber.word)}
                  className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>听单词</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedNumber(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-xl transition-colors"
              >
                返回数字表
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NumbersSection;