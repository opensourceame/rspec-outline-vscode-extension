import * as vscode from 'vscode';
import { RSpecNode } from './types';
import { RSpecParser } from './rspecParser';

export class RSpecOutlineProvider implements vscode.TreeDataProvider<RSpecNode> {
  private _onDidChangeTreeData = new vscode.EventEmitter<RSpecNode | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private _rootNodes: RSpecNode[] = [];
  private _currentFile: vscode.Uri | undefined;

  constructor() {
    // Listen for active editor changes
    vscode.window.onDidChangeActiveTextEditor(this.onActiveEditorChanged, this);

    // Listen for document changes
    vscode.workspace.onDidChangeTextDocument(this.onDocumentChanged, this);

    // Initial load
    this.onActiveEditorChanged();
  }

  refresh(): void {
    console.log('[RSpecOutlineProvider] Refresh called, firing tree data change event');
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: RSpecNode): vscode.TreeItem {
    console.log(`[RSpecOutlineProvider] getTreeItem called for: ${element.name} (${element.type})`);
    const item = new vscode.TreeItem(
      element.name,
      element.children.length > 0
        ? vscode.TreeItemCollapsibleState.Expanded
        : vscode.TreeItemCollapsibleState.None
    );

    item.tooltip = `${element.type} at line ${element.line}`;
    item.command = {
      command: 'vscode.open',
      title: 'Open',
      arguments: [
        vscode.Uri.file(element.filePath),
        { selection: new vscode.Range(element.line - 1, 0, element.line - 1, 0) },
      ],
    };

    // Set icons based on node type
    item.iconPath = this.getIconPath(element.type);

    // Style skipped nodes
    if (element.isSkipped) {
      item.description = '(skipped)';
      item.iconPath = new vscode.ThemeIcon('debug-stackframe-unfocused');
    }

    // Set context value for conditional styling
    item.contextValue = `${element.type}${element.isSkipped ? '_skipped' : ''}`;

    return item;
  }

  getChildren(element?: RSpecNode): Thenable<RSpecNode[]> {
    console.log(
      `[RSpecOutlineProvider] getChildren called, element: ${element ? element.name : 'root'}`
    );
    if (!element) {
      console.log(`[RSpecOutlineProvider] Returning ${this._rootNodes.length} root nodes`);
      return Promise.resolve(this._rootNodes);
    }
    console.log(
      `[RSpecOutlineProvider] Returning ${element.children.length} children for ${element.name}`
    );
    return Promise.resolve(element.children);
  }

  private async onActiveEditorChanged(): Promise<void> {
    console.log('[RSpecOutlineProvider] Active editor changed');

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      console.log('[RSpecOutlineProvider] No active editor found');
      this._rootNodes = [];
      this._currentFile = undefined;
      this.refresh();
      return;
    }

    const document = editor.document;
    console.log(`[RSpecOutlineProvider] Active file: ${document.fileName}`);

    if (!document.fileName.endsWith('_spec.rb')) {
      console.log('[RSpecOutlineProvider] File is not an RSpec file, clearing outline');
      this._rootNodes = [];
      this._currentFile = undefined;
      this.refresh();
      return;
    }

    console.log('[RSpecOutlineProvider] RSpec file detected, parsing...');
    this._currentFile = document.uri;
    await this.parseAndUpdateOutline(document);
  }

  private async onDocumentChanged(event: vscode.TextDocumentChangeEvent): Promise<void> {
    if (!this._currentFile || event.document.uri.fsPath !== this._currentFile.fsPath) {
      return;
    }

    // Debounce rapid changes
    await this.parseAndUpdateOutline(event.document);
  }

  private async parseAndUpdateOutline(document: vscode.TextDocument): Promise<void> {
    if (!document.fileName.endsWith('_spec.rb')) {
      return;
    }

    console.log(`[RSpecOutlineProvider] Parsing document: ${document.fileName}`);
    const result = RSpecParser.parseFile(document.getText(), document.fileName);

    if (result.success) {
      console.log(`[RSpecOutlineProvider] Successfully parsed ${result.data.length} root nodes`);
      this._rootNodes = result.data;
    } else {
      console.error(`[RSpecOutlineProvider] Parsing failed: ${result.error}`);
      this._rootNodes = [];
      vscode.window.showErrorMessage(`Failed to parse RSpec file: ${result.error}`);
    }

    console.log('[RSpecOutlineProvider] Refreshing tree view');
    this.refresh();
  }



  private getIconPath(type: string): vscode.ThemeIcon {
    switch (type) {
      case 'describe':
      case 'xdescribe':
        return new vscode.ThemeIcon('file-directory');
      case 'context':
      case 'xcontext':
        return new vscode.ThemeIcon('folder');
      case 'it':
      case 'xit':
        return new vscode.ThemeIcon('check');
      case 'before':
        return new vscode.ThemeIcon('arrow-up');
      case 'after':
        return new vscode.ThemeIcon('arrow-down');
      case 'let':
        return new vscode.ThemeIcon('variable');
      default:
        return new vscode.ThemeIcon('symbol-misc');
    }
  }
}
