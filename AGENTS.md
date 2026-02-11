# AGENTS.md - RSpec Outline VS Code Extension

This file contains development guidelines and commands for agentic coding agents working on the RSpec Outline VS Code extension.

## Project Overview

This VS Code extension adds an Outline view for RSpec files (`*_spec.rb`). It parses Ruby RSpec files and creates a hierarchical tree view with the following node types:

- `describe`, `context`, `it`, `before`, `after`, `let`
- Skipped variants: `xdescribe`, `xcontext`, `xit` (rendered in italics)

## Build, Test, and Lint Commands

### Development Commands
```bash
# Compile TypeScript for type checking only
npm run compile

# Development build with watch and sourcemaps
npm run dev

# Production build (minified)
npm run vscode:prepublish

# Package extension
npm run build
```

### Testing Commands
```bash
# Run all tests
npm test

# Run single test file
npm test -- --grep "RSpecParser"

# Run tests with coverage
npm run test:coverage
```

### Code Quality Commands
```bash
# Lint TypeScript files
npm run lint

# Lint and auto-fix
npm run lint:fix

# Format code with Prettier
npm run format

# Type checking
npm run type-check
```

## Code Style Guidelines

### TypeScript Configuration
- Use strict TypeScript settings in `tsconfig.json`
- Enable `noImplicitAny`, `strictNullChecks`, `noImplicitReturns`
- Use `target: ES2020`, `module: commonjs`, `moduleResolution: node`

### Import Organization
```typescript
// 1. Node.js built-in modules
import * as path from 'path';
import * as fs from 'fs';

// 2. VS Code modules
import * as vscode from 'vscode';

// 3. Third-party modules
import { SomeLibrary } from 'some-library';

// 4. Local modules (relative imports)
import { RSpecNode } from './types';
import { RSpecParser } from './rspecParser';
```

### Naming Conventions
- **Classes**: PascalCase (`RSpecOutlineProvider`, `RSpecNode`)
- **Interfaces**: PascalCase with `I` prefix optional (`IRSpecNode`)
- **Methods/Functions**: camelCase (`parseRSpecFile`, `createTreeItem`)
- **Constants**: UPPER_SNAKE_CASE (`RSPEC_FILE_PATTERN`, `SKIPPED_PREFIXES`)
- **Variables**: camelCase (`lineNumber`, `nodeType`, `isSkipped`)

### Error Handling
```typescript
// Use Result/Either pattern for parsing operations
type ParseResult<T> = { success: true; data: T } | { success: false; error: string };

// Always handle async errors with try-catch
async function parseFile(uri: vscode.Uri): Promise<ParseResult<RSpecNode[]>> {
  try {
    const content = await vscode.workspace.fs.readFile(uri);
    return parseRSpecContent(content.toString());
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
```

### File Structure Patterns
```
src/
├── extension.ts              # Main extension entry point
├── rspec/
│   ├── rspecParser.ts        # Core parsing logic
│   ├── rspecOutlineProvider.ts # Tree data provider
│   └── types.ts              # Type definitions
├── test/
│   ├── suite/
│   │   ├── rspecParser.test.ts
│   │   └── extension.test.ts
│   └── runTest.ts
└── utils/
    ├── fileUtils.ts
    └── regexPatterns.ts
```

### Code Formatting Rules
- Use Prettier with: `singleQuote: true`, `trailingComma: es5`, `printWidth: 100`
- Always use semicolons
- Use 2 spaces for indentation
- Prefer `const` over `let`, avoid `var`

### VS Code Extension Patterns

#### Tree Data Provider Implementation
```typescript
export class RSpecOutlineProvider implements vscode.TreeDataProvider<RSpecNode> {
  private _onDidChangeTreeData = new vscode.EventEmitter<RSpecNode | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: RSpecNode): vscode.TreeItem {
    const item = new vscode.TreeItem(element.name, element.children.length > 0 
      ? vscode.TreeItemCollapsibleState.Expanded 
      : vscode.TreeItemCollapsibleState.None);
    
    item.tooltip = `${element.type} at line ${element.line}`;
    item.command = {
      command: 'vscode.open',
      title: 'Open',
      arguments: [vscode.Uri.file(element.filePath), { selection: element.line }]
    };
    
    if (element.isSkipped) {
      item.description = '(skipped)';
    }
    
    return item;
  }
}
```

#### Command Registration
```typescript
export function activate(context: vscode.ExtensionContext) {
  const outlineProvider = new RSpecOutlineProvider();
  
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('rspecOutline', outlineProvider),
    vscode.commands.registerCommand('rspecOutline.refresh', () => outlineProvider.refresh())
  );
}
```

### Testing Guidelines
- Use Mocha with `@vscode/test-electron`
- Write unit tests for parsing logic
- Write integration tests for VS Code API interactions
- Mock VS Code APIs where appropriate
- Test edge cases: empty files, malformed RSpec, nested structures

### Performance Considerations
- Parse files lazily (only when opened in editor)
- Use debounced updates for file changes
- Cache parsed results with file content hash
- Limit tree depth for very large RSpec files

### Security Best Practices
- Never use `eval()` or similar dynamic code execution
- Validate all file paths and user inputs
- Use VS Code's secure file system APIs
- Don't log sensitive file contents

## Development Workflow

1. **Setup**: Run `npm install` to install dependencies
2. **Development**: Use `npm run dev` for watch mode with sourcemaps
3. **Testing**: Run `npm test` before committing changes
4. **Linting**: Run `npm run lint:fix` to auto-fix style issues
5. **Building**: Use `npm run vscode:prepublish` for production build

## Debugging

Use VS Code's debugging configuration in `.vscode/launch.json`:
- "Run Extension" for development testing
- "Run Extension Tests" for test debugging
- Set breakpoints in TypeScript source files

## Extension Points

- **Activation**: `onLanguage:ruby`
- **Views**: Explorer tree view for `*_spec.rb` files
- **Commands**: Refresh outline, navigate to test
- **Contributions**: Context menus for test actions