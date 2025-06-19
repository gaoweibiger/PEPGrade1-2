import React, { useState } from 'react';
import { Volume2, ArrowLeft } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface ColorsSectionProps {
  onBack: () => void;
}

const colorsData = [
  { name: 'Red', chinese: '红色', color: '#EF4444', emoji: '🔴' },
  { name: 'Blue', chinese: '蓝色', color: '#3B82F6', emoji: '🔵' },
  { name: 'Green', chinese: '绿色', color: '#10B981', emoji: '🟢' },
  { name: 'Yellow', chinese: '黄色', color: '#F59E0B', emoji: '🟡' },
  { name: 'Orange', chinese: '橙色', color: '#F97316', emoji: '🟠' },
  { name: 'Purple', chinese: '紫色', color: '#8B5CF6', emoji: '🟣' },
  { name: 'Pink', chinese: '粉色', color: '#EC4899', emoji: '🩷' },
  { name: 'Brown', chinese: '棕色', color: '#A3653B', emoji: '🤎' },
];

const ColorsSection: React.FC<ColorsSectionProps> = ({ onBack }) => {
  const [selectedColor, setSelectedColor] = useState<typeof colorsData[0] | null>(null);
  const { speak } = useSpeech();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
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

        {!selectedColor ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">学颜色 Colors</h2>
              <p className="text-lg text-gray-600">点击颜色来学习英文名称！</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {colorsData.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setSelectedColor(item)}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
                >
                  <div className="text-center">
                    <div 
                      className="w-20 h-20 rounded-full mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="text-2xl mb-2">{item.emoji}</div>
                    <div className="text-lg font-bold text-gray-800 mb-1">{item.name}</div>
                    <div className="text-sm text-gray-600">{item.chinese}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div 
                className="w-32 h-32 rounded-full mx-auto mb-6 shadow-xl"
                style={{ backgroundColor: selectedColor.color }}
              ></div>
              
              <div className="text-6xl mb-6">{selectedColor.emoji}</div>
              
              <h3 className="text-4xl font-bold text-gray-800 mb-2">
                {selectedColor.name}
              </h3>
              
              <div className="text-xl text-gray-600 mb-6">
                {selectedColor.chinese}
              </div>

              <button
                onClick={() => speak(selectedColor.name)}
                className="flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-colors mb-6 mx-auto"
              >
                <Volume2 className="w-5 h-5" />
                <span>听发音</span>
              </button>

              <button
                onClick={() => setSelectedColor(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-xl transition-colors"
              >
                返回颜色表
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorsSection;