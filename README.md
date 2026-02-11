# RSpec Outline View VS Code Extension

A VS Code extension that provides an outline view for RSpec files (`*_spec.rb`). It parses Ruby RSpec files and creates a hierarchical tree view showing the structure of your tests.

## Features

- 📋 **Outline View**: See the structure of your RSpec files in a tree view
- 🔍 **Navigation**: Click on any node to jump directly to that line in the file
- 🎯 **Smart Detection**: Automatically detects `*_spec.rb` files and updates the outline
- 🚫 **Skipped Tests**: Visual distinction for skipped tests (`xdescribe`, `xcontext`, `xit`)
- 🔄 **Real-time Updates**: Outline updates automatically as you edit the file
- 🎨 **Visual Icons**: Different icons for different RSpec block types

## Supported RSpec Elements

The extension recognizes the following RSpec elements:

- `describe` - Top-level test groups
- `context` - Nested test groups  
- `it` - Individual test cases
- `before` - Setup hooks
- `after` - Teardown hooks
- `let` - Memoized helper methods
- `xdescribe`, `xcontext`, `xit` - Skipped variants (shown in italics)

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X)
3. Search for "RSpec Outline View"
4. Click Install

Or install from the marketplace: [RSpec Outline View](https://marketplace.visualstudio.com/items?itemName=your-publisher.rspec-outline-view)

## Usage

1. Open an RSpec file (`*_spec.rb`)
2. The outline view will automatically appear in the Explorer panel
3. Click on any node in the outline to navigate to that location
4. Use the refresh button to manually update the outline

### Example RSpec File

```ruby
describe "User authentication" do
  let(:user) { User.new(email: "test@example.com") }

  before do
    # Setup code
  end

  context "with valid credentials" do
    it "allows login" do
      # Test implementation
    end

    it "redirects to dashboard" do
      # Test implementation
    end
  end

  context "with invalid credentials" do
    it "shows error message" do
      # Test implementation
    end
  end

  after do
    # Cleanup code
  end
end
```

## Development

### Prerequisites

- Node.js 18+
- VS Code
- Git

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/rspec-outline-vscode-extension.git
   cd rspec-outline-vscode-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Open in VS Code:
   ```bash
   code .
   ```

4. Run the extension in development mode:
   - Press F5 or go to Run > Start Debugging
   - This will open a new VS Code window with the extension loaded

### Build and Test

```bash
# Compile TypeScript
npm run compile

# Run in watch mode for development
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Build extension package
npm run build
```

### Project Structure

```
src/
├── extension.ts              # Main extension entry point
├── rspecParser.ts            # RSpec file parsing logic
├── rspecOutlineProvider.ts   # Tree data provider for outline view
├── types.ts                  # TypeScript type definitions
└── test/
    ├── suite/
    │   ├── rspecParser.test.ts
    │   └── index.ts
    └── runTest.ts
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and ensure tests pass
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

### 0.0.1
- Initial release
- Basic outline view for RSpec files
- Support for describe, context, it, before, after, let blocks
- Skipped test detection
- Navigation functionality

## Issues

Please report issues on the [GitHub repository](https://github.com/your-username/rspec-outline-vscode-extension/issues).

## Support

If you find this extension helpful, please consider ⭐ starring the repository!