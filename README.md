# 🎓 PEP Grade 1-2 English Learning System

> 🌟 An interactive English learning application designed for PEP (People's Education Press) Grade 1-2 curriculum with advanced speech synthesis and WeChat browser optimization.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🚀 Live Demo

- **Main Application**: [PEP Grade 1-2 Learning System](https://pepgrade1-2.netlify.app)
- **WeChat Test Page**: [WeChat Browser Speech Test](https://pepgrade1-2.netlify.app/wechat-test.html)

## ✨ Features

### 🎵 Advanced Speech Synthesis
- **WeChat Browser Optimization** - Perfect compatibility with WeChat's built-in browser
- **Enhanced Speech Buttons** - 5-state visual feedback (idle, loading, playing, success, error)
- **Batch Speech Player** - Play entire units with customizable settings
- **Auto-retry Mechanism** - Intelligent error recovery and retry logic
- **Environment Detection** - Automatic browser detection and parameter adjustment

### 📚 Learning Modules
- **Unit-based Learning** - Systematic progression through PEP curriculum
- **Word Challenges** - Interactive vocabulary building exercises
- **Phrase Practice** - Common phrase learning with pronunciation
- **Sentence Construction** - Complete sentence formation and practice
- **Random Challenges** - Mixed content for comprehensive testing

### 📱 Mobile & WeChat Optimized
- **Responsive Design** - Perfect on all screen sizes
- **WeChat Integration** - Seamless experience in WeChat browser
- **Touch-friendly Interface** - Optimized for mobile interactions
- **Progressive Web App** - App-like experience on mobile devices

### 🎯 User Experience
- **Interactive Guides** - Step-by-step speech setup tutorials
- **Visual Feedback** - Clear status indicators and progress tracking
- **Error Handling** - Intelligent error messages and recovery
- **Accessibility** - Screen reader friendly and keyboard navigation

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Lucide React for beautiful icons
- **Speech API**: Web Speech API with custom optimizations
- **State Management**: React Hooks and Context

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern browser with Web Speech API support

### Quick Start

```bash
# Clone the repository
git clone https://github.com/gaoweibiger/PEPGrade1-2.git

# Navigate to project directory
cd PEPGrade1-2

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser and visit
# http://localhost:5173
```

### Build for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

## 🎮 Usage

### Basic Learning Flow

1. **Choose Learning Mode**
   - Select from unit-based learning or challenge modes
   - Each mode offers different learning approaches

2. **Interactive Learning**
   - Click speech buttons to hear pronunciations
   - Practice with visual and audio feedback
   - Track your progress through each unit

3. **WeChat Browser Setup** (if applicable)
   - Follow the automatic setup guide
   - Enable speech functionality with one-click activation
   - Enjoy seamless learning experience

### Speech Features

#### Enhanced Speech Buttons
- **Single Click**: Play individual words/phrases
- **Visual States**: See loading, playing, success, and error states
- **Auto-retry**: Automatic retry on failure (up to 2 times)
- **Status Tooltips**: Helpful hints and status information

#### Batch Speech Player
- **Play All**: Listen to entire units sequentially
- **Custom Settings**: Adjust playback speed and intervals
- **Progress Tracking**: Visual progress bar and completion status
- **Individual Control**: Play specific items from the list

## 🔧 Configuration

### Speech Settings
The application automatically detects your browser environment and optimizes speech settings:

- **WeChat Browser**: Slower playback speed (0.7x) for better compatibility
- **Standard Browsers**: Normal playback speed (0.8x)
- **Auto-retry**: Enabled by default with intelligent backoff

### Environment Variables
Create a `.env` file for custom configurations:

```env
# Optional: Custom API endpoints
VITE_API_BASE_URL=your-api-url

# Optional: Analytics tracking
VITE_ANALYTICS_ID=your-analytics-id
```

## 📱 WeChat Browser Support

This application is specially optimized for WeChat's built-in browser:

### Features
- **Audio Context Initialization** - Proper audio setup for WeChat
- **User Interaction Detection** - Ensures speech functionality activation
- **Optimized Playback Parameters** - Adjusted for WeChat's audio limitations
- **Guided Setup Process** - Step-by-step activation tutorial

### Testing
Use the dedicated WeChat test page: `/wechat-test.html`

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── EnhancedSpeechButton.tsx    # Advanced speech button
│   ├── BatchSpeechPlayer.tsx       # Batch playback component
│   ├── WeChatGuide.tsx            # WeChat setup guide
│   ├── SpeechGuide.tsx            # General speech guide
│   └── ...                        # Other components
├── hooks/               # Custom React hooks
│   └── useSpeech.ts    # Unified speech interface
├── utils/              # Utility functions
│   └── speechUtils.ts  # Core speech functionality
├── data/               # Learning content data
│   └── pepData.ts      # PEP curriculum data
└── App.tsx             # Main application component
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Ensure mobile responsiveness
- Test speech functionality across browsers
- Add appropriate documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **PEP Curriculum Team** - For the educational content structure
- **React Community** - For the amazing ecosystem
- **Web Speech API** - For enabling speech synthesis
- **Tailwind CSS** - For the beautiful styling system

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/gaoweibiger/PEPGrade1-2/issues)
- **Discussions**: [GitHub Discussions](https://github.com/gaoweibiger/PEPGrade1-2/discussions)
- **Email**: [Contact Developer](mailto:160695728+gaoweibiger@users.noreply.github.com)

## 🔄 Changelog

### v1.0.0 (Latest)
- ✨ Complete speech optimization for WeChat browser
- 🎵 Enhanced speech buttons with 5-state feedback
- 📱 Batch speech player with customizable settings
- 🔧 Intelligent auto-retry mechanism
- 📚 Comprehensive user guides and tutorials
- 🎯 Mobile-first responsive design
- 🚀 Performance optimizations and error handling

---

<div align="center">
  <p>Made with ❤️ for English learners</p>
  <p>🌟 Star this repo if you find it helpful!</p>
</div>
