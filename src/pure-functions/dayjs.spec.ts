#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test } from 'tstest'

import { dayjs } from './dayjs.js'

test('dayjs() smoke testing', async t => {
  const text = dayjs(Date.now() + 10000).fromNow()
  const expected = '几秒内'
  t.equal(text, expected, 'should calculate correct')

  // console.info(dayjs(Date.now() + 10e5).format('LLLL'))
})
