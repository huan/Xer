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
import { test }     from 'tstest'
import * as CQRS    from 'wechaty-cqrs'

import { skipSelfMessagePayload$ }    from './mod.js'
import { chatbotFixtures }            from '../test-driven-development/chatbot-fixtures.js'

test('skipSelfMessagePayload$', async t => {
  for await (const {
    mocker: mockerFixture,
    wechaty: wechatyFixture,
  } of chatbotFixtures()) {

    // wechatyFixture.wechaty.on('message', msg => console.info('### DEBUG [Wechaty]', String(msg)))

    const bus$ = CQRS.from(wechatyFixture.wechaty)

    const messagePayloadList = []

    skipSelfMessagePayload$(bus$)(wechatyFixture.wechaty.puppet.id)
      .subscribe(e => {
        messagePayloadList.push(e)
      })

    messagePayloadList.length = 0
    mockerFixture.player.say('hello').to(mockerFixture.bot)
    await new Promise(setImmediate)
    t.ok(messagePayloadList.length, 'should pass message sent from player')

    messagePayloadList.length = 0
    mockerFixture.bot.say('hello').to(mockerFixture.player)
    await new Promise(setImmediate)
    t.notOk(messagePayloadList.length, 'should skip message from bot (self)')

  }
})
