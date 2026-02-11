export type RSpecNodeType = 
  | 'describe'
  | 'context'
  | 'it'
  | 'before'
  | 'after'
  | 'let'
  | 'xdescribe'
  | 'xcontext'
  | 'xit';

export interface RSpecNode {
  type: RSpecNodeType;
  name: string;
  line: number;
  filePath: string;
  children: RSpecNode[];
  isSkipped: boolean;
  parent?: RSpecNode;
}

export type ParseResult<T> = { success: true; data: T } | { success: false; error: string };

export interface RSpecFileContent {
  nodes: RSpecNode[];
  filePath: string;
}

export const RSPEC_FILE_PATTERN = '*_spec.rb';
export const SKIPPED_PREFIXES = ['xdescribe', 'xcontext', 'xit'];
export const VALID_PREFIXES = [
  'describe',
  'context', 
  'it',
  'before',
  'after',
  'let',
  'xdescribe',
  'xcontext',
  'xit'
];