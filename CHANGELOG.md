# Changelog

All notable changes to the "RSpec Outline View" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.1] - 2024-02-11

### Added
- Initial release of RSpec Outline View extension
- Tree view in Explorer panel for RSpec files (`*_spec.rb`)
- Support for parsing RSpec blocks:
  - `describe` and `xdescribe`
  - `context` and `xcontext` 
  - `it` and `xit`
  - `before` hooks
  - `after` hooks
  - `let` definitions
- Visual distinction for skipped tests (italics and special icon)
- Click-to-navigate functionality for all outline nodes
- Real-time outline updates when editing files
- Automatic outline updates when switching between RSpec files
- Refresh command for manual outline updates
- TypeScript implementation with strict type checking
- Comprehensive test suite for parser functionality
- ESBuild-based build system for fast compilation
- ESLint and Prettier configuration for code quality

### Technical Details
- Built with TypeScript 5.x
- Uses VS Code Extension API
- Tree data provider pattern for outline view
- Regex-based RSpec parsing with proper indentation handling
- Event-driven updates for file changes and editor switches
- VS Code 1.74+ support
- Node.js 18+ compatibility