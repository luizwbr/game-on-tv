# Contributing to Game-on-TV

Thank you for your interest in contributing to Game-on-TV! This document provides guidelines for contributing to the project.

## Code of Conduct

Please be respectful and considerate in all interactions within the project.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- System information (OS, Node version, TV model)
- Logs if applicable

### Suggesting Features

Feature requests are welcome! Please:
- Check if the feature has already been requested
- Clearly describe the feature and its benefits
- Explain your use case

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Open a pull request

#### PR Guidelines

- Keep changes focused and atomic
- Update documentation as needed
- Add tests if applicable
- Follow existing code style
- Ensure all tests pass

## Development Setup

### PC Controller

```bash
cd pc-controller
npm install
npm run dev
```

### Tizen TV App

Requires Tizen Studio. See [tizen-tv/README.md](tizen-tv/README.md)

## Code Style

- Use consistent indentation (2 spaces)
- Follow existing patterns in the codebase
- Write clear, descriptive variable names
- Comment complex logic
- Keep functions small and focused

## Testing

### PC Controller
```bash
cd pc-controller
npm test
```

### Manual Testing
- Test on real hardware when possible
- Verify network functionality
- Check UI on different resolutions

## Documentation

- Update README files for significant changes
- Document new features and APIs
- Include code comments for complex logic

## Commit Messages

Use clear, descriptive commit messages:

```
feat: Add 4K resolution support
fix: Resolve WebSocket connection issue
docs: Update installation instructions
refactor: Simplify server discovery logic
```

Prefix types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

## Questions?

Feel free to open an issue for questions or clarifications.

Thank you for contributing! 🎮
