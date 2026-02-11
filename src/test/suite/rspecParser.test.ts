import * as assert from 'assert';
import { RSpecParser } from '../../../src/rspecParser';
// import { RSpecNodeType } from '../../../src/types';

suite('RSpecParser Tests', () => {
  test('should parse basic describe block', () => {
    const content = `describe "my feature" do
  it "does something" do
    # test code
  end
end`;

    const result = RSpecParser.parseFile(content, '/test/spec.rb');
    
    assert.strictEqual(result.success, true);
    const nodes = result.data;
    assert.strictEqual(nodes.length, 1);
    assert.strictEqual(nodes[0].type, 'describe');
    assert.strictEqual(nodes[0].name, 'my feature');
    assert.strictEqual(nodes[0].line, 1);
    assert.strictEqual(nodes[0].children.length, 1);
    
    const child = nodes[0].children[0];
    assert.strictEqual(child.type, 'it');
    assert.strictEqual(child.name, 'does something');
    assert.strictEqual(child.line, 2);
  });

  test('should parse nested describe and context blocks', () => {
    const content = `describe "User" do
  let(:user) { User.new }
  
  context "when valid" do
    it "is valid" do
      # validation test
    end
  end
  
  context "when invalid" do
    it "is not valid" do
      # invalidation test
    end
  end
end`;

    const result = RSpecParser.parseFile(content, '/test/user_spec.rb');
    
    assert.strictEqual(result.success, true);
    const nodes = result.data;
    assert.strictEqual(nodes.length, 1);
    
    const describeNode = nodes[0];
    assert.strictEqual(describeNode.type, 'describe');
    assert.strictEqual(describeNode.name, 'User');
    assert.strictEqual(describeNode.children.length, 3); // let + 2 contexts
    
    const contextNodes = describeNode.children.filter((child: any) => child.type === 'context');
    assert.strictEqual(contextNodes.length, 2);
    
    const validContext = contextNodes[0];
    assert.strictEqual(validContext.name, 'when valid');
    assert.strictEqual(validContext.children.length, 1);
    assert.strictEqual(validContext.children[0].name, 'is valid');
  });

  test('should parse skipped variants', () => {
    const content = `describe "feature" do
  xcontext "skipped context" do
    xit "skipped test" do
      # skipped test
    end
  end
  
  it "active test" do
    # active test
  end
end`;

    const result = RSpecParser.parseFile(content, '/test/skipped_spec.rb');
    
    assert.strictEqual(result.success, true);
    const nodes = result.data;
    const describeNode = nodes[0];
    
    const contextNode = describeNode.children.find((child: any) => child.type === 'xcontext');
    assert.strictEqual(contextNode?.isSkipped, true);
    
    const skippedTest = contextNode?.children.find((child: any) => child.type === 'xit');
    assert.strictEqual(skippedTest?.isSkipped, true);
    
    const activeTest = describeNode.children.find((child: any) => child.type === 'it');
    assert.strictEqual(activeTest?.isSkipped, false);
  });

  test('should parse before and after hooks', () => {
    const content = `describe "hooks" do
  before do
    # setup
  end
  
  after do
    # teardown
  end
  
  it "runs with hooks" do
    # test
  end
end`;

    const result = RSpecParser.parseFile(content, '/test/hooks_spec.rb');
    
    assert.strictEqual(result.success, true);
    const nodes = result.data;
    const describeNode = nodes[0];
    
    const beforeNode = describeNode.children.find((child: any) => child.type === 'before');
    const afterNode = describeNode.children.find((child: any) => child.type === 'after');
    const itNode = describeNode.children.find((child: any) => child.type === 'it');
    
    assert.strictEqual(beforeNode?.type, 'before');
    assert.strictEqual(afterNode?.type, 'after');
    assert.strictEqual(itNode?.type, 'it');
  });

  test('should handle empty files gracefully', () => {
    const content = '';
    const result = RSpecParser.parseFile(content, '/test/empty_spec.rb');
    
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.data.length, 0);
  });

  test('should handle files with no RSpec blocks', () => {
    const content = `# This is a regular Ruby file
class MyClass
  def method_name
    puts "hello world"
  end
end`;

    const result = RSpecParser.parseFile(content, '/test/regular.rb');
    
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.data.length, 0);
  });

  test('should extract names with different quote styles', () => {
    const content = `describe 'single quotes' do
  describe "double quotes" do
    describe :symbol do
      it 'works' do
      end
    end
  end
end`;

    const result = RSpecParser.parseFile(content, '/test/quotes_spec.rb');
    
    assert.strictEqual(result.success, true);
    const nodes = result.data;
    
    assert.strictEqual(nodes[0].name, 'single quotes');
    assert.strictEqual(nodes[0].children[0].name, 'double quotes');
    assert.strictEqual(nodes[0].children[0].children[0].name, 'symbol');
  });
});