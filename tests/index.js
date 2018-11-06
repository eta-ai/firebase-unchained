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
  const key = "key";
  const input = {
    push: function() {
      return key;
    }
  };
  const output = unchainFirebase(input);
  const expected = key;
  const out = output.ppush(input);
  if (out.then) {
    out
      .then(function(actual) {
        t.equal(actual, expected);
        t.end();
      })
      .catch(function(err) {
        t.end(err);
      });
  } else {
    const actual = out;
    t.equal(actual, expected);
    t.end();
  }
});

test("query supports nullary options", function(t) {
  const path = "/the/path";
  const ref = {
    orderByPriority: stub().returnsThis(),
    startAt: stub().returnsThis()
  };
  const db = {
    child: stub().returns(ref)
  };
  const expected = ref;
  const actual = unchainedFns.query(db)(path, {
    orderByPriority: undefined,
    startAt: 1
  });
  t.equal(actual, expected, "output");
  t.deepEqual(db.child.args, [[path]], "child");
  t.deepEqual(ref.orderByPriority.args, [[]], "nullary");
  t.deepEqual(ref.startAt.args, [[1]], "unary");
  t.end();
});
