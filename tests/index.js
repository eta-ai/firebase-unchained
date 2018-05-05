import test from 'tape'
import { stub } from 'sinon'

import promisify from '../src'
import * as promisedFns from '../src/api'

test('promisify adds methods to object', t => {
  const input = {}
  const output = promisify(input)
  for (let name in promisedFns) {
    t.ok(output[name], name)
  }
  t.end()
})

test('promisify partially applies db', async t => {
  const key = 'key'
  const input = {
    push: () => key
  }
  const output = promisify(input)
  const expected = key
  const actual = await output.ppush(input)
  t.equal(actual, expected)
  t.end()
})

test('query supports nullary options', async t => {
  const path = '/the/path'
  const ref = {
    orderByPriority: stub().returnsThis(),
    startAt: stub().returnsThis()
  }
  const db = {
    child: stub().returns(ref)
  }
  const expected = ref
  const actual = promisedFns.query(db)(path, {
    orderByPriority: undefined,
    startAt: 1
  })
  t.equal(actual, expected, 'output')
  t.deepEqual(db.child.args, [ [ path ] ], 'child')
  t.deepEqual(ref.orderByPriority.args, [ [] ], 'nullary')
  t.deepEqual(ref.startAt.args, [ [ 1 ] ], 'unary')
  t.end()
})
