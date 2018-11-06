const test = require("tape");
const { stub } = require("sinon");

const unchainFirebase = require("../src");
const unchainedFns = require("../src/api");

test("unchainFirebase adds methods to object", function(t) {
  const input = {};
  const output = unchainFirebase(input);
  for (let name in unchainedFns) {
    t.ok(output[name], name);
  }
  t.end();
});

test("unchainFirebase partially applies db", function(t) {
  const path = "path/to/value";
  const value = { key: "key" };
  const push = stub().returns(value);
  const ref = stub().returns({ push });
  const input = { push, ref };
  const output = unchainFirebase(input);
  const expected = value.key;
  const actual = output.generateId(path);
  t.equal(actual, expected);
  t.deepEqual(ref.args, [[path]], "ref args");
  t.deepEqual(push.args, [[]], "push args");
  t.end();
});

test("query supports nullary options", function(t) {
  const path = "the/path";
  const ref = {
    orderByPriority: stub().returnsThis(),
    startAt: stub().returnsThis()
  };
  const db = {
    ref: stub().returns(ref)
  };
  const expected = ref;
  const actual = unchainedFns.query(db)(path, {
    orderByPriority: undefined,
    startAt: 1
  });
  t.equal(actual, expected, "output");
  t.deepEqual(db.ref.args, [[path]], "child");
  t.deepEqual(ref.orderByPriority.args, [[]], "nullary");
  t.deepEqual(ref.startAt.args, [[1]], "unary");
  t.end();
});
