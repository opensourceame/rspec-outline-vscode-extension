# Development Setup Instructions

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run in development mode:**
   ```bash
   npm run dev
   ```

3. **Debug in VS Code:**
   - Open the project in VS Code
   - Press F5 or go to Run > Start Debugging
   - This will open a new VS Code window with the extension loaded

## Testing the Extension

1. **Open a test RSpec file:**
   ```bash
   code test_examples/user_spec.rb
   ```

2. **Check the Explorer panel:**
   - You should see "RSpec Outline" in the Explorer
   - Click on nodes to navigate to the corresponding lines

3. **Test skipped variants:**
   - Open a file with `xdescribe`, `xcontext`, or `xit`
   - These should appear with "(skipped)" label

## Verification Checklist

- [ ] Extension activates when opening Ruby files
- [ ] Outline view appears in Explorer for `*_spec.rb` files
- [ ] Tree structure correctly shows nested blocks
- [ ] Click navigation works
- [ ] Skipped tests are visually distinguished
- [ ] Refresh command works
- [ ] Real-time updates when editing files
- [ ] No TypeScript compilation errors
- [ ] All tests pass
- [ ] Linting passes

## Building for Production

```bash
# Build minified extension
npm run vscode:prepublish

# Package as VSIX file
npm run build
```

## Common Issues

1. **Extension not appearing:**
   - Ensure the file ends with `_spec.rb`
   - Check that the file is recognized as Ruby language

2. **Compilation errors:**
   - Run `npm run compile` to check TypeScript compilation
   - Run `npm run lint` to check for code style issues

3. **Test failures:**
   - Ensure all dependencies are installed
   - Check that TypeScript compilation succeeds before running tests