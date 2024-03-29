#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/**
 *   Xer is a dating bot target for getting more conversions from online dating apps
 *
 *   @copyright 2022 Xuan Jiang <https://github.com/xjiang67>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import { test }      from 'tstest'

import type { Duckula } from 'mailbox'

import * as mod    from './mod.js'

test('mod is a Duckula', async t => {
  const duckula: Duckula = mod
  t.ok(duckula, 'should satisfy Duckula Interface for mod export')
})

test('mod.Context', async t => {
  const context: mod.Context = {} as any
  t.ok(context, 'should has Context interface')
})
