import React, { useState } from 'react';
import { Volume2, ArrowLeft } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface AlphabetSectionProps {
  onBack: () => void;
}

const alphabetData = [
  { letter: 'A', word: 'Apple', emoji: '🍎', phonics: '/æ/' },
  { letter: 'B', word: 'Ball', emoji: '⚽', phonics: '/b/' },
  { letter: 'C', word: 'Cat', emoji: '🐱', phonics: '/k/' },
  { letter: 'D', word: 'Dog', emoji: '🐶', phonics: '/d/' },
  { letter: 'E', word: 'Egg', emoji: '🥚', phonics: '/e/' },
  { letter: 'F', word: 'Fish', emoji: '🐟', phonics: '/f/' },
  { letter: 'G', word: 'Gift', emoji: '🎁', phonics: '/g/' },
  { letter: 'H', word: 'Hat', emoji: '👒', phonics: '/h/' },
  { letter: 'I', word: 'Ice', emoji: '🧊', phonics: '/aɪ/' },
  { letter: 'J', word: 'Juice', emoji: '🧃', phonics: '/dʒ/' },
  { letter: 'K', word: 'Kite', emoji: '🪁', phonics: '/k/' },
  { letter: 'L', word: 'Lion', emoji: '🦁', phonics: '/l/' },
];

const AlphabetSection: React.FC<AlphabetSectionProps> = ({ onBack }) => {
  const [selectedLetter, setSelectedLetter] = useState<typeof alphabetData[0] | null>(null);
  const { speak } = useSpeech();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
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

        {!selectedLetter ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">学字母 ABC</h2>
              <p className="text-lg text-gray-600">点击字母来学习发音和单词！</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {alphabetData.map((item) => (
                <button
                  key={item.letter}
                  onClick={() => setSelectedLetter(item)}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
                >
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-2 group-hover:text-blue-700">
                      {item.letter}
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
              <div className="text-8xl font-bold text-blue-600 mb-4">
                {selectedLetter.letter}
              </div>
              
              <div className="text-6xl mb-6">{selectedLetter.emoji}</div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                {selectedLetter.word}
              </h3>
              
              <div className="text-lg text-gray-600 mb-6">
                发音: {selectedLetter.phonics}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <button
                  onClick={() => speak(selectedLetter.letter)}
                  className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>听字母</span>
                </button>

                <button
                  onClick={() => speak(selectedLetter.word)}
                  className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>听单词</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedLetter(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-xl transition-colors"
              >
                返回字母表
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlphabetSection;