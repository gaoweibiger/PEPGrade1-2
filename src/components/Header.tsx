import React from 'react';
import { BookOpen, Star } from 'lucide-react';

interface HeaderProps {
  currentSection: string;
}

const Header: React.FC<HeaderProps> = ({ currentSection }) => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white p-3 sm:p-4 shadow-2xl border-b border-purple-500/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              PEP一年级下册知识点速览
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 hidden sm:block">First Grade English Learning System</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-full px-3 py-1 sm:px-4 sm:py-2 border border-purple-500/30">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-yellow-400" />
            <span className="text-xs sm:text-sm font-semibold text-purple-200">学习进行中</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;