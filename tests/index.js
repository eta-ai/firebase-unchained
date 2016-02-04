import test from 'tape'

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
