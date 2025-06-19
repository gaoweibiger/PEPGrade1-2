import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, CheckCircle, XCircle, RotateCcw, Trophy, Eye, Star, Zap } from 'lucide-react';
import { WordItem, PhraseItem, SentenceItem, getAllWords, getAllPhrases, getAllSentences, shuffleArray } from '../data/pepData';
import { useSpeech } from '../hooks/useSpeech';
import EnhancedSpeechButton from './EnhancedSpeechButton';

interface ChallengeModeProps {
  onBack: () => void;
  mode: 'words' | 'phrases' | 'sentences' | 'random';
}

type QuestionItem = WordItem | PhraseItem | SentenceItem;

interface Question {
  item: QuestionItem;
  options: string[];
  correctAnswer: string;
}

interface AnswerRecord {
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
}

const ChallengeMode: React.FC<ChallengeModeProps> = ({ onBack, mode }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);
  const [showWrongAnswers, setShowWrongAnswers] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const { speak } = useSpeech();

  // 生成粒子效果
  const generateParticles = () => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setParticles(newParticles);
  };

  useEffect(() => {
    generateParticles();
  }, []);

  const generateQuestions = () => {
    let allItems: QuestionItem[] = [];
    
    switch (mode) {
      case 'words':
        allItems = getAllWords();
        break;
      case 'phrases':
        allItems = getAllPhrases();
        break;
      case 'sentences':
        allItems = getAllSentences();
        break;
      case 'random':
        allItems = [...getAllWords(), ...getAllPhrases(), ...getAllSentences()];
        break;
    }

    const shuffledItems = shuffleArray(allItems).slice(0, 10);
    
    const generatedQuestions: Question[] = shuffledItems.map(item => {
      const correctAnswer = item.chinese;
      const wrongAnswers = shuffleArray(
        allItems.filter(i => i.chinese !== correctAnswer).map(i => i.chinese)
      ).slice(0, 3);
      
      const options = shuffleArray([correctAnswer, ...wrongAnswers]);
      
      return {
        item,
        options,
        correctAnswer
      };
    });

    setQuestions(generatedQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setGameComplete(false);
    setAnswerRecords([]);
    setShowWrongAnswers(false);
  };

  useEffect(() => {
    generateQuestions();
  }, [mode]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    const newRecord: AnswerRecord = {
      question: questions[currentQuestion],
      userAnswer: selectedAnswer,
      isCorrect
    };
    
    const newRecords = [...answerRecords, newRecord];
    setAnswerRecords(newRecords);
    
    if (isCorrect) {
      setScore(score + 1);
      // 正确答案时生成庆祝粒子
      generateParticles();
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer('');
        setShowResult(false);
      } else {
        setGameComplete(true);
      }
    }, 2000);
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'words': return '单词闯关';
      case 'phrases': return '短语闯关';
      case 'sentences': return '句子闯关';
      case 'random': return '随机闯关';
      default: return '闯关模式';
    }
  };

  const getScoreColor = () => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = () => {
    if (score >= 9) return '完美！你是英语小天才！🌟';
    if (score >= 7) return '很棒！继续加油！🎉';
    if (score >= 5) return '不错！还有进步空间！💪';
    return '加油！多练习会更好！📚';
  };

  const wrongAnswers = answerRecords.filter(record => !record.isCorrect);

  // 错题查看组件
  const WrongAnswersView = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-red-400 mb-2">错题回顾</h3>
        <p className="text-gray-300 text-sm sm:text-base">共 {wrongAnswers.length} 道错题，让我们一起复习吧！</p>
      </div>
      
      {wrongAnswers.map((record, index) => (
        <div key={index} className="bg-slate-800/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 sm:space-x-4 mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-400 font-bold text-sm sm:text-base">{index + 1}</span>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-purple-400 truncate">
                  {record.question.item.english}
                </span>
                <EnhancedSpeechButton
                  text={record.question.item.english}
                  size="sm"
                  variant="primary"
                  className="flex-shrink-0"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="bg-red-600/20 border border-red-500/50 rounded-xl p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-red-300 mb-1">你的答案</div>
              <div className="text-base sm:text-lg font-semibold text-red-400 flex items-center">
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span className="truncate">{record.userAnswer}</span>
              </div>
            </div>
            
            <div className="bg-green-600/20 border border-green-500/50 rounded-xl p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-green-300 mb-1">正确答案</div>
              <div className="text-base sm:text-lg font-semibold text-green-400 flex items-center">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span className="truncate">{record.question.correctAnswer}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="text-center pt-4">
        <button
          onClick={() => setShowWrongAnswers(false)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-6 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          返回成绩页面
        </button>
      </div>
    </div>
  );

  if (gameComplete) {
    if (showWrongAnswers) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 relative overflow-hidden">
          {/* 动态背景粒子 */}
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-purple-400/30 rounded-full animate-pulse"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  animationDelay: `${particle.id * 0.1}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-6 sm:mb-8">
                <button
                  onClick={() => setShowWrongAnswers(false)}
                  className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 text-white active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">返回成绩</span>
                </button>
              </div>
              
              <WrongAnswersView />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 relative overflow-hidden">
        {/* 动态背景效果 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-purple-600/10 animate-pulse"></div>
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-bounce opacity-70"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${particle.id * 0.2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 p-4 sm:p-6 flex items-center justify-center min-h-screen">
          <div className="bg-slate-800/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-purple-500/30 text-center max-w-2xl w-full shadow-2xl">
            {/* 成就徽章 */}
            <div className="relative mb-6 sm:mb-8">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              </div>
              {score >= 8 && (
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-spin">
                  <Star className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              )}
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              挑战完成！
            </h2>
            
            <div className={`text-6xl sm:text-8xl font-bold mb-4 sm:mb-6 ${getScoreColor()} drop-shadow-lg`}>
              {score}/10
            </div>
            
            <p className="text-xl sm:text-3xl text-gray-300 mb-6 sm:mb-8 font-semibold">{getScoreMessage()}</p>
            
            {/* 详细统计 */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-green-600/20 rounded-xl p-3 sm:p-4 border border-green-500/30">
                <div className="text-xl sm:text-2xl font-bold text-green-400">{score}</div>
                <div className="text-xs sm:text-sm text-green-300">正确</div>
              </div>
              <div className="bg-red-600/20 rounded-xl p-3 sm:p-4 border border-red-500/30">
                <div className="text-xl sm:text-2xl font-bold text-red-400">{10 - score}</div>
                <div className="text-xs sm:text-sm text-red-300">错误</div>
              </div>
              <div className="bg-blue-600/20 rounded-xl p-3 sm:p-4 border border-blue-500/30">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">{Math.round((score / 10) * 100)}%</div>
                <div className="text-xs sm:text-sm text-blue-300">正确率</div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3 sm:space-y-4">
              <button
                onClick={generateQuestions}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">再来一次</span>
              </button>
              
              {wrongAnswers.length > 0 && (
                <button
                  onClick={() => setShowWrongAnswers(true)}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">查看错题 ({wrongAnswers.length})</span>
                </button>
              )}
              
              <button
                onClick={onBack}
                className="flex items-center justify-center space-x-2 bg-slate-700/80 hover:bg-slate-600/80 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 shadow-lg active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">返回主页</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-white text-xl sm:text-2xl animate-pulse">正在准备题目...</div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 relative overflow-hidden">
      {/* 动态背景粒子效果 */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-purple-400/40 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.id * 0.1}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* 背景光效 */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-blue-600/5 animate-pulse"></div>
      
      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-5xl mx-auto">
          {/* 移动端优化的顶部导航栏 */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 bg-slate-800/60 backdrop-blur-lg rounded-xl px-3 py-2 sm:px-6 sm:py-3 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 text-white shadow-lg hover:shadow-purple-500/20 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold text-sm sm:text-base">返回</span>
            </button>
            
            <div className="text-center flex-1 mx-2 sm:mx-4">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {getModeTitle()}
              </h2>
              <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-purple-300">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-lg font-semibold">第 {currentQuestion + 1} 题 / 共 10 题</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-xl px-3 py-2 sm:px-6 sm:py-3 border border-purple-500/30 backdrop-blur-sm">
                <div className="text-xl sm:text-3xl font-bold text-purple-400 flex items-center">
                  <Star className="w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                  {score}
                </div>
                <div className="text-xs sm:text-sm text-purple-300">得分</div>
              </div>
            </div>
          </div>

          {/* 移动端优化的进度条 */}
          <div className="mb-8 sm:mb-10">
            <div className="relative w-full h-3 sm:h-4 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50 backdrop-blur-sm">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${((currentQuestion + 1) / 10) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full animate-pulse"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            </div>
          </div>

          {/* 移动端优化的题目卡片 */}
          <div className="bg-slate-800/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-slate-700/50 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
            {/* 题目区域 */}
            <div className="text-center mb-8 sm:mb-10">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-4 sm:mb-6">
                <div className="relative">
                  <h3 className="text-3xl sm:text-5xl font-bold text-purple-400 drop-shadow-lg break-words">
                    {currentQ.item.english}
                  </h3>
                  {showResult && selectedAnswer === currentQ.correctAnswer && (
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  )}
                </div>
                <EnhancedSpeechButton
                  text={currentQ.item.english}
                  size="lg"
                  variant="primary"
                  showStatus={true}
                  autoRetry={true}
                />
              </div>
              <p className="text-lg sm:text-2xl text-gray-300 font-semibold">请选择正确的中文意思</p>
            </div>

            {/* 移动端优化的选项区域 */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-8 sm:mb-10">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className={`relative p-4 sm:p-8 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-lg sm:text-xl font-semibold overflow-hidden group active:scale-95 ${
                    selectedAnswer === option
                      ? showResult
                        ? option === currentQ.correctAnswer
                          ? 'bg-green-600/30 border-green-400 text-green-300 shadow-lg shadow-green-500/20'
                          : 'bg-red-600/30 border-red-400 text-red-300 shadow-lg shadow-red-500/20'
                        : 'bg-purple-600/30 border-purple-400 text-purple-300 shadow-lg shadow-purple-500/20'
                      : showResult && option === currentQ.correctAnswer
                      ? 'bg-green-600/30 border-green-400 text-green-300 shadow-lg shadow-green-500/20'
                      : 'bg-slate-700/50 border-slate-600 text-white hover:border-purple-500/70 hover:bg-slate-600/60 hover:shadow-lg hover:shadow-purple-500/10'
                  }`}
                >
                  {/* 背景光效 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-center justify-between">
                    <span className="flex-1 text-left break-words">{option}</span>
                    {showResult && (
                      <div className="ml-4 flex-shrink-0">
                        {option === currentQ.correctAnswer ? (
                          <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-green-400 animate-pulse" />
                        ) : selectedAnswer === option ? (
                          <XCircle className="w-5 h-5 sm:w-7 sm:h-7 text-red-400 animate-pulse" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* 提交按钮 */}
            {!showResult && (
              <div className="text-center">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className={`relative px-8 py-4 sm:px-12 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 overflow-hidden active:scale-95 ${
                    selectedAnswer
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white transform hover:scale-105 shadow-lg hover:shadow-purple-500/30'
                      : 'bg-slate-700/50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {selectedAnswer && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 animate-pulse"></div>
                  )}
                  <span className="relative flex items-center justify-center space-x-2">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>提交答案</span>
                  </span>
                </button>
              </div>
            )}

            {/* 结果显示 */}
            {showResult && (
              <div className="text-center">
                <div className={`text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 flex items-center justify-center space-x-2 sm:space-x-3 ${
                  selectedAnswer === currentQ.correctAnswer ? 'text-green-400' : 'text-red-400'
                }`}>
                  {selectedAnswer === currentQ.correctAnswer ? (
                    <>
                      <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 animate-bounce" />
                      <span>回答正确！🎉</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
                      <span>回答错误！😔</span>
                    </>
                  )}
                </div>
                {selectedAnswer !== currentQ.correctAnswer && (
                  <div className="bg-green-600/20 rounded-xl p-3 sm:p-4 border border-green-500/30 inline-block max-w-full">
                    <p className="text-gray-300 text-base sm:text-lg break-words">
                      正确答案是：<span className="text-green-400 font-bold text-lg sm:text-xl">{currentQ.correctAnswer}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeMode;