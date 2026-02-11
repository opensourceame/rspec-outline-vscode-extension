Parser

Scan lines in an rspec file which are written in Ruby.

Create a tree of nodes, where node type can be one of:

* describe
* context
* it
* before
* after
* let

Additional node types that denote that a test is skipped:

* xdescribe
* xcontext
* xit

Skipped nodes should be rendered differently (italics)


when a line begins with any of these prefixes it is the start of a node

## Testing

Use the following to test that the correct outline is rendered

```
describe "my feature" do
  let (:val_first)  { first_value }
  let (:val_second) { second_value }
  context "situation A" do
    it "does something with A" do
      # some code
    end
  end
end
```