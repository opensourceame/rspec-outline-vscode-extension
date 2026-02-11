import * as vscode from 'vscode';
import { RSpecOutlineProvider } from './rspecOutlineProvider';
import { RSpecParser } from './rspecParser';

let outlineProvider: RSpecOutlineProvider;

function convertToDocumentSymbols(nodes: any[]): vscode.DocumentSymbol[] {
  const symbols: vscode.DocumentSymbol[] = [];

  function processNode(node: any, parentSymbol?: vscode.DocumentSymbol): void {
    const range = new vscode.Range(node.line - 1, 0, node.line - 1, node.name.length);
    const symbol = new vscode.DocumentSymbol(
      node.name,
      node.type,
      getSymbolKind(node.type),
      range,
      range
    );

    if (parentSymbol) {
      parentSymbol.children.push(symbol);
    } else {
      symbols.push(symbol);
    }

    // Process children
    node.children.forEach((child: any) => processNode(child, symbol));
  }

  nodes.forEach((node: any) => processNode(node));
  return symbols;
}

function getSymbolKind(type): vscode.SymbolKind {
    // Use different icons for different element types
    switch (type) {
      case 'describe':
      case 'xdescribe':
        return vscode.SymbolKind.Module;
      case 'context':
      case 'xcontext':
        return vscode.SymbolKind.Namespace;
      case 'it':
      case 'xit':
        return vscode.SymbolKind.Method;
      case 'before':
        return vscode.SymbolKind.Function;
      case 'after':
        return vscode.SymbolKind.Function;
      case 'let':
        return vscode.SymbolKind.Variable;
      default:
        return vscode.SymbolKind.Object;
    }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('[Extension] RSpec Outline View extension is now active!');
  console.log('[Extension] Registering tree data provider for rspecOutline');

  // Create the outline provider
  outlineProvider = new RSpecOutlineProvider();

  // Register the tree data provider
  const treeDataProvider = vscode.window.registerTreeDataProvider('rspecOutline', outlineProvider);
  console.log('[Extension] Tree data provider registered successfully');

  // Register document symbol provider for outline integration
  const symbolProvider = vscode.languages.registerDocumentSymbolProvider(
    { language: 'ruby' },
    {
      provideDocumentSymbols: (document: vscode.TextDocument) => {
        if (!document.fileName.endsWith('_spec.rb')) {
          return [];
        }

        const result = RSpecParser.parseFile(document.getText(), document.fileName);
        if (!result.success) {
          return [];
        }

        return convertToDocumentSymbols(result.data);
      },
    }
  );

  // Register commands
  const refreshCommand = vscode.commands.registerCommand('rspecOutline.refresh', () => {
    console.log('[Extension] Refresh command triggered');
    outlineProvider.refresh();
  });

  const testCommand = vscode.commands.registerCommand('rspecOutline.test', () => {
    console.log('[Extension] Test command triggered');
    vscode.window.showInformationMessage('RSpec Outline extension is working!');

    // Force refresh of the tree view
    outlineProvider.refresh();
    vscode.commands.executeCommand('workbench.action.focusSideBar');
  });

  // Add to subscriptions
  context.subscriptions.push(treeDataProvider, symbolProvider, refreshCommand, testCommand);
  console.log('[Extension] Tree data provider, symbol provider and commands registered');

  // Show initial status message
  vscode.window.showInformationMessage(
    'RSpec Outline View activated. Open a *_spec.rb file to see the outline.'
  );
}

export function deactivate() {
  console.log('RSpec Outline View extension deactivated');
}
