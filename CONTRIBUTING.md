# 🤝 Contributing to PEP Grade 1-2 English Learning System

Thank you for your interest in contributing to our English learning application! We welcome contributions from developers, educators, and language learning enthusiasts.

## 🌟 Ways to Contribute

### 🐛 Bug Reports
- Report bugs through [GitHub Issues](https://github.com/gaoweibiger/PEPGrade1-2/issues)
- Include detailed steps to reproduce
- Mention your browser and device information
- For speech-related issues, specify if you're using WeChat browser

### ✨ Feature Requests
- Suggest new learning features or improvements
- Propose UI/UX enhancements
- Request additional language support
- Share ideas for better speech functionality

### 📝 Documentation
- Improve README and documentation
- Add code comments and examples
- Create tutorials or guides
- Translate documentation to other languages

### 💻 Code Contributions
- Fix bugs and implement features
- Improve performance and accessibility
- Add tests and improve code coverage
- Enhance mobile and WeChat browser compatibility

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git for version control
- Basic knowledge of React and TypeScript
- Understanding of Web Speech API (for speech-related contributions)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/PEPGrade1-2.git
   cd PEPGrade1-2
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📋 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Use Tailwind CSS for styling (avoid custom CSS when possible)
- Implement responsive design (mobile-first approach)
- Ensure accessibility (ARIA labels, keyboard navigation)

### Component Structure
```typescript
// Example component structure
import React from 'react';
import { SomeIcon } from 'lucide-react';

interface ComponentProps {
  // Define props with TypeScript
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  
  return (
    <div className="responsive-classes">
      {/* JSX content */}
    </div>
  );
};

export default Component;
```

### Speech Functionality
- Use the `useSpeech` hook for all speech-related features
- Test thoroughly in both standard browsers and WeChat
- Implement proper error handling and user feedback
- Consider accessibility for users with hearing impairments

### Testing
- Test on multiple browsers (Chrome, Firefox, Safari, WeChat)
- Verify mobile responsiveness on different screen sizes
- Test speech functionality with various text inputs
- Ensure proper error handling and recovery

## 🔧 Technical Areas

### High Priority
- **Speech Optimization**: Improve WeChat browser compatibility
- **Performance**: Optimize loading times and responsiveness
- **Accessibility**: Enhance screen reader support and keyboard navigation
- **Mobile UX**: Improve touch interactions and mobile-specific features

### Medium Priority
- **Content Management**: Better tools for managing learning content
- **Analytics**: Usage tracking and learning progress analytics
- **Internationalization**: Support for multiple languages
- **Offline Support**: Progressive Web App features

### Low Priority
- **Advanced Features**: Gamification, social features, advanced analytics
- **Integration**: Third-party service integrations
- **Customization**: User preferences and customizable themes

## 📝 Pull Request Process

### Before Submitting
1. **Test Thoroughly**
   - Verify your changes work in multiple browsers
   - Test speech functionality if applicable
   - Check mobile responsiveness
   - Ensure no console errors

2. **Code Quality**
   - Run `npm run lint` to check for linting issues
   - Run `npm run build` to ensure production build works
   - Add appropriate TypeScript types
   - Follow existing code patterns

3. **Documentation**
   - Update README if adding new features
   - Add inline comments for complex logic
   - Update component documentation

### Submitting PR
1. **Create Descriptive Title**
   ```
   feat: Add batch speech player with progress tracking
   fix: Resolve WeChat browser audio initialization issue
   docs: Update installation instructions
   ```

2. **Write Clear Description**
   - Explain what changes were made and why
   - Include screenshots for UI changes
   - Mention any breaking changes
   - Reference related issues

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Performance improvement

   ## Testing
   - [ ] Tested in Chrome/Firefox/Safari
   - [ ] Tested in WeChat browser
   - [ ] Tested on mobile devices
   - [ ] Speech functionality verified

   ## Screenshots (if applicable)
   Add screenshots here

   ## Additional Notes
   Any additional information
   ```

## 🎯 Specific Contribution Areas

### Speech Functionality
- Improve WeChat browser compatibility
- Add support for more languages
- Enhance error handling and recovery
- Optimize playback performance

### Educational Content
- Add more PEP curriculum units
- Improve content organization
- Add pronunciation guides
- Create interactive exercises

### User Experience
- Enhance mobile interactions
- Improve accessibility features
- Add user preferences
- Create better onboarding

### Performance
- Optimize bundle size
- Improve loading times
- Enhance speech synthesis performance
- Add offline capabilities

## 🐛 Bug Report Template

When reporting bugs, please include:

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- Browser: [e.g., Chrome 91, WeChat Browser]
- Device: [e.g., iPhone 12, Android Samsung]
- OS: [e.g., iOS 14, Android 11]

**Screenshots**
Add screenshots if applicable

**Additional Context**
Any other relevant information
```

## 📞 Getting Help

- **Questions**: Use [GitHub Discussions](https://github.com/gaoweibiger/PEPGrade1-2/discussions)
- **Issues**: Report bugs via [GitHub Issues](https://github.com/gaoweibiger/PEPGrade1-2/issues)
- **Email**: Contact maintainers directly for sensitive issues

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special thanks in documentation

Thank you for helping make English learning more accessible and enjoyable! 🌟
