import * as vscode from 'vscode';
import { RSpecNode, RSpecNodeType, ParseResult, VALID_PREFIXES, SKIPPED_PREFIXES } from './types';

export class RSpecParser {
  // Optional prefix: Rspec. or RSpec. (e.g. Rspec.describe "..." do)
  private static readonly NODE_PATTERN =
    /^\s*(?:R[sS]pec\.)?(describe|context|it|around|before|prepend_before|after|append_after|let|xdescribe|xcontext|xit)\s+(.+)/i;

  static parseFile(content: string, filePath: string): ParseResult<RSpecNode[]> {
    console.log(`[RSpecParser] Parsing file: ${filePath}`);
    console.log(`[RSpecParser] Content length: ${content.length} characters`);

    try {
      const lines = content.split('\n');
      const rootNodes: RSpecNode[] = [];
      const nodeStack: RSpecNode[] = [];
      console.log(`[RSpecParser] Processing ${lines.length} lines`);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNumber = i + 1;

        const match = line.match(this.NODE_PATTERN);
        if (!match) {
          continue;
        }

        const [, typeStr, rest] = match;
        console.log(`[RSpecParser] Found RSpec node at line ${lineNumber}: ${typeStr}`);
        const type = typeStr.toLowerCase() as RSpecNodeType;

        if (!VALID_PREFIXES.includes(type)) {
          continue;
        }

        const name = this.extractName(rest, type);
        const isSkipped = SKIPPED_PREFIXES.includes(type);

        const node: RSpecNode = {
          type,
          name,
          line: lineNumber,
          filePath,
          children: [],
          isSkipped,
        };

        // Determine parent-child relationship
        const indentationLevel = this.getIndentationLevel(line);

        // Find the appropriate parent by looking at the stack
        while (nodeStack.length > 0) {
          const potentialParent = nodeStack[nodeStack.length - 1];
          const parentLine = lines[potentialParent.line - 1];
          const parentIndentation = this.getIndentationLevel(parentLine);

          if (parentIndentation < indentationLevel) {
            node.parent = potentialParent;
            potentialParent.children.push(node);
            break;
          }
          nodeStack.pop();
        }

        // If no parent found, it's a root node
        if (!node.parent) {
          rootNodes.push(node);
        }

        nodeStack.push(node);
      }

      console.log(`[RSpecParser] Parsed ${rootNodes.length} root nodes`);
      // Log node structure without circular references
      console.log(
        `[RSpecParser] Node tree:`,
        JSON.stringify(
          rootNodes,
          (key, value) => {
            if (key === 'parent') return undefined;
            return value;
          },
          2
        )
      );
      return { success: true, data: rootNodes };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown parsing error',
      };
    }
  }

  private static extractName(rest: string, _type: RSpecNodeType): string {
    const hookTypes = ['before', 'after', 'around', 'prepend_before', 'append_after'];
    if (hookTypes.includes(_type)) {
      return _type;
    }

    // Remove leading quotes and capture the name
    const nameMatch =
      rest.match(/^["']([^"']+)["']/) || rest.match(/^(\w+)/) || rest.match(/^\(([^)]+)\)/);

    if (nameMatch) {
      return nameMatch[1].trim();
    }

    // Fallback: clean up the rest of the line
    return rest
      .split(/\s+/)[0]
      .replace(/[{}()]/g, '')
      .trim();
  }

  private static getIndentationLevel(line: string): number {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
  }

  static async parseFileFromUri(uri: vscode.Uri): Promise<ParseResult<RSpecNode[]>> {
    try {
      const content = await vscode.workspace.fs.readFile(uri);
      const contentStr = Buffer.from(content).toString('utf8');
      return this.parseFile(contentStr, uri.fsPath);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to read file',
      };
    }
  }
}
