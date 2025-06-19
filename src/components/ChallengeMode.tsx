import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, CheckCircle, XCircle, RotateCcw, Trophy, Eye, Star, Zap } from 'lucide-react';
import { WordItem, PhraseItem, SentenceItem, getAllWords, getAllPhrases, getAllSentences, shuffleArray } from '../data/pepData';
import { useSpeech } from '../hooks/useSpeech';
import EnhancedSpeechButton from './EnhancedSpeechButton';
import { AudioUtils } from '../utils/audioUtils';
import ChallengeResult from './ChallengeResult';

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
  const [confetti, setConfetti] = useState<Array<{
    id: number,
    x: number,
    y: number,
    vx: number,
    vy: number,
    color: string,
    size: number,
    rotation: number,
    rotationSpeed: number
  }>>([]);
  const [showConfetti, setShowConfetti] = useState(false);
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

  // 生成撒花特效
  const generateConfetti = () => {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10
    }));
    setConfetti(newConfetti);
    setShowConfetti(true);

    // 3秒后清除撒花效果
    setTimeout(() => {
      setShowConfetti(false);
      setConfetti([]);
    }, 3000);
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

    console.log(`${mode} 模式下可用题目数量:`, allItems.length);

    // 确保有足够的题目，如果不足5个，就重复使用
    let selectedItems: QuestionItem[] = [];
    if (allItems.length >= 5) {
      selectedItems = shuffleArray(allItems).slice(0, 5);
    } else {
      // 如果题目不足5个，重复使用直到达到5个
      const repeatedItems = [];
      for (let i = 0; i < 5; i++) {
        repeatedItems.push(allItems[i % allItems.length]);
      }
      selectedItems = shuffleArray(repeatedItems);
    }

    const generatedQuestions: Question[] = selectedItems.map(item => {
      const correctAnswer = item.chinese;

      // 从所有题目中选择错误答案，确保有足够的选项
      let allOptionsPool = allItems;
      if (allItems.length < 4) {
        // 如果选项池太小，从所有类型中选择
        allOptionsPool = [...getAllWords(), ...getAllPhrases(), ...getAllSentences()];
      }

      const wrongAnswers = shuffleArray(
        allOptionsPool.filter(i => i.chinese !== correctAnswer).map(i => i.chinese)
      ).slice(0, 3);

      const options = shuffleArray([correctAnswer, ...wrongAnswers]);

      return {
        item,
        options,
        correctAnswer
      };
    });

    console.log('生成的题目数量:', generatedQuestions.length);
    setQuestions(generatedQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setGameComplete(false);
    setAnswerRecords([]);
    setShowWrongAnswers(false);
  };

  useEffect(() => {
    console.log('模式切换到:', mode);
    generateQuestions();
  }, [mode]);

  // 预加载音频文件
  useEffect(() => {
    AudioUtils.preloadAudios(['/ok.mp3']).catch(error => {
      console.warn('音频预加载失败:', error);
    });

    // 组件卸载时清理音频缓存
    return () => {
      AudioUtils.clearCache();
    };
  }, []);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    const currentQ = questions[currentQuestion];
    const isCorrect = selectedAnswer.trim() === currentQ.correctAnswer.trim();

    console.log('答题详情:', {
      题目: currentQ.item.english,
      用户答案: `"${selectedAnswer}"`,
      正确答案: `"${currentQ.correctAnswer}"`,
      是否正确: isCorrect,
      当前题号: currentQuestion + 1
    });

    const newRecord: AnswerRecord = {
      question: currentQ,
      userAnswer: selectedAnswer,
      isCorrect
    };

    const newRecords = [...answerRecords, newRecord];
    setAnswerRecords(newRecords);

    if (isCorrect) {
      setScore(score + 1);
      console.log('答对了！当前得分:', score + 1);
      // 正确答案时生成庆祝粒子
      generateParticles();
    } else {
      console.log('答错了！当前得分:', score);
    }

    setShowResult(true);
    
    setTimeout(() => {
      const nextQuestionIndex = currentQuestion + 1;
      console.log(`当前题目: ${currentQuestion + 1}, 总题目: ${questions.length}, 下一题: ${nextQuestionIndex + 1}`);

      if (nextQuestionIndex < questions.length && nextQuestionIndex < 5) {
        // 还有题目，继续下一题
        setCurrentQuestion(nextQuestionIndex);
        setSelectedAnswer('');
        setShowResult(false);
        console.log(`进入第 ${nextQuestionIndex + 1} 题`);
      } else {
        // 完成所有题目或达到5题
        console.log('挑战完成！最终得分:', score + (isCorrect ? 1 : 0));
        setGameComplete(true);
        // 如果全部正确，触发撒花特效和播放音频
        const finalScore = score + (isCorrect ? 1 : 0);
        if (finalScore === 5) {
          console.log('满分！触发撒花特效和播放音频');
          generateConfetti();
          // 播放成功音效
          AudioUtils.playSuccessSound().catch(error => {
            console.warn('播放成功音效失败:', error);
          });
        }
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
    if (score >= 4) return 'text-green-400';
    if (score >= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = () => {
    if (score >= 5) return '完美！你是英语小天才！🌟';
    if (score >= 4) return '很棒！继续加油！🎉';
    if (score >= 3) return '不错！还有进步空间！💪';
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

    // 使用新的炫酷结果页面
    return (
      <ChallengeResult
        score={score}
        totalQuestions={5}
        wrongAnswers={wrongAnswers}
        onRestart={generateQuestions}
        onBack={onBack}
        onShowWrongAnswers={() => setShowWrongAnswers(true)}
      />
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
                <span className="text-sm sm:text-lg font-semibold">第 {currentQuestion + 1} 题 / 共 5 题</span>
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
                style={{ width: `${((currentQuestion + 1) / 5) * 100}%` }}
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