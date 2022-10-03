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
/* eslint-disable sort-keys */
import {
  AnyEventObject,
  interpret,
  createMachine,
}                                   from 'xstate'
import { of }                       from 'rxjs'
import { map, mergeMap, filter }    from 'rxjs/operators'
import { test, sinon }              from 'tstest'
import * as Mailbox                 from 'mailbox'
import * as CQRS                    from 'wechaty-cqrs'
import { isActionOf }               from 'typesafe-actions'
import * as WechatyActor            from 'wechaty-actor'

import { dayjs, skipSelfMessagePayload$ }    from '../pure-functions/mod.js'
import { chatbotFixtures }                   from '../test-driven-development/chatbot-fixtures.js'

import duckula, { Context }   from './duckula.js'

import { datingPitchesMachine }   from './machine.js'

test('Calling machine step by step', async t => {
  for await (const {
    mocker: mockerFixture,
    wechaty: wechatyFixture,
  } of chatbotFixtures()) {

    const sandbox = sinon.createSandbox({
      useFakeTimers: { now: Date.now() },
    })

    wechatyFixture.wechaty.on('message', msg => console.info('DEBUG [Wechaty]', String(msg)))

    const bus$ = CQRS.from(wechatyFixture.wechaty)
    const wechatyMailbox = WechatyActor.from(bus$, wechatyFixture.wechaty.puppet.id)
    wechatyMailbox.open()

    const datingPitchesMailbox = Mailbox.from(datingPitchesMachine.withContext({
      ...duckula.initialContext(),
      actors: {
        wechaty: String(wechatyMailbox.address),
      },
    }))
    datingPitchesMailbox.open()

    const TEST_ID = 'TestMachine'
    const testMachine = createMachine({
      id: TEST_ID,
      on: {
        '*': {
          actions: Mailbox.actions.proxy(TEST_ID)(datingPitchesMailbox),
        },
      },
    })

    const testEventList: AnyEventObject[] = []
    const testInterpreter = interpret(testMachine)
    testInterpreter
      .onEvent(e => testEventList.push(e))
      .start()

    skipSelfMessagePayload$(bus$)(wechatyFixture.wechaty.puppet.id).pipe(
      map(messagePayload => duckula.Event.MESSAGE(messagePayload)),
    ).subscribe(e => {
      console.info('### duckula.Event.MESSAGE', e)
      testInterpreter.send(e)
    })

    const pitchInterpreter = (datingPitchesMailbox as Mailbox.impls.Mailbox).internal.actor.interpreter!
    const pitchSnapshot    = () => pitchInterpreter.getSnapshot()
    const pitchContext     = () => pitchSnapshot().context as Context
    const pitchState       = () => pitchSnapshot().value   as typeof duckula.State

    const datingPitchesEventList: AnyEventObject[] = []
    pitchInterpreter.onTransition(state => {
      console.info('### callingInterpreter.onTransition', state.value, state.event.type)
      datingPitchesEventList.push(state.event)
    })

    t.equal(pitchState(), duckula.State.Idle, 'should be idle state')
    t.same(pitchContext().startTime, undefined, 'should has no startTime')

    /**
     * 1st event
     */
    testInterpreter.send(duckula.Event.REPLY())
    await sandbox.clock.tickAsync(1000)

    t.equal(pitchState(), duckula.State.FirstPitched, 'should be State.FirstPitched')
    t.notOk(pitchContext().startTime, 'should have no startTime')
    t.notOk(pitchContext().message, 'should have no current message payload in context')

    t.same(
      datingPitchesEventList
        .map(e => e.type),
      [
        'xstate.init',
        duckula.Type.REPLY,
      ],
      'should receive bunch of events after send REPLY',
    )

    /**
     * 2nd event
     */
    datingPitchesEventList.length = 0

    testInterpreter.send(duckula.Event.REPLY())
    await sandbox.clock.tickAsync(1000)

    t.equal(pitchState(), duckula.State.SecondPitched, 'should be State.SecondPitched')
    t.notOk(pitchContext().startTime, 'should have no startTime')
    t.notOk(pitchContext().message, 'should have no current message payload in context')

    t.same(
      datingPitchesEventList.map(e => e.type),
      [
        duckula.Type.REPLY,
      ],
      'should receive bunch of events after send REPLY',
    )

    /**
     * 3rd event
     */
    datingPitchesEventList.length = 0

    testInterpreter.send(duckula.Event.REPLY())
    await sandbox.clock.tickAsync(1000)

    t.equal(pitchState(), duckula.State.CoffeeRequested, 'should be State.CoffeeRequested')
    t.notOk(pitchContext().startTime, 'should have no startTime')
    t.notOk(pitchContext().message, 'should have no current message payload in context')

    t.same(
      datingPitchesEventList.map(e => e.type),
      [
        duckula.Type.REPLY,
      ],
      'should receive bunch of events after send REPLY',
    )

    /**
     * 4rd event
     */
    datingPitchesEventList.length = 0

    testInterpreter.send(duckula.Event.ACCEPT())
    await sandbox.clock.tickAsync(1000)

    t.equal(pitchState(), duckula.State.Success, 'should be State.Success')
    t.notOk(pitchContext().startTime, 'should have no startTime')
    t.notOk(pitchContext().message, 'should have no current message payload in context')

    t.same(
      datingPitchesEventList.map(e => e.type),
      [
        duckula.Type.ACCEPT,
      ],
      'should receive bunch of events after send REPLY',
    )

    sandbox.restore()
  }

})
