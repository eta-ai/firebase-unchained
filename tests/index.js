import test from 'tape'

import * as firebaseUnchained from '../src'

const { default: promisify, ...promisedFns } = firebaseUnchained

test('promisify adds methods to object', t => {
  const input = {}
  const output = promisify(input)
  for (let fn in promisedFns) {
    t.ok(output[fn])
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
