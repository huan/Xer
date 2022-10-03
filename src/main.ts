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
import * as WECHATY         from 'wechaty'
import * as CQRS            from 'wechaty-cqrs'
import * as WechatyActor    from 'wechaty-actor'

import {
  createMachine,
  interpret,
}                           from 'xstate'
import * as Mailbox         from 'mailbox'

import { log }            from 'brolog'
import { map }            from 'rxjs/operators'
import qrcodeTerminal     from 'qrcode-terminal'

import * as DatingPitchesActor        from './conversational-state-machine/mod.js'
import { skipSelfMessagePayload$ }    from './pure-functions/skip-self-message-payload$.js'

async function main () {
  /**
   * Wechaty Actor
   */
  const wechaty = WECHATY.WechatyBuilder.build()
  await wechaty.init()

  const bus$ = CQRS.from(wechaty)
  const wechatyActor = WechatyActor.from(bus$, wechaty.puppet.id)
  wechatyActor.open()

  /**
   * Dating Pitches Actor
   */
  const datingPitchesMailbox = Mailbox.from(
    DatingPitchesActor.machine.withContext({
      ...DatingPitchesActor.initialContext(),
      actors: {
        wechaty: String(wechatyActor.address),
      },
    }),
  )
  datingPitchesMailbox.open()

  const MAIN_MACHINE_ID = 'MainMachine'
  const mainMachine = createMachine({
    id: MAIN_MACHINE_ID,
    on: {
      '*': {
        actions: Mailbox.actions.proxy(MAIN_MACHINE_ID)(datingPitchesMailbox),
      },
    },
  })

  /**
   * Connect Wechaty with the Main Machine Interpreter
   */
  const mainInterpreter = interpret(mainMachine)
  mainInterpreter
    .onEvent(e => console.info('mainInterpreter.onEvent()', e))
    .start()

  skipSelfMessagePayload$(bus$)(wechaty.puppet.id).pipe(
    map(messagePayload => DatingPitchesActor.Event.MESSAGE(messagePayload)),
  ).subscribe(e => {
    console.info('### DatingPitchesActor.Event.MESSAGE', e)
    mainInterpreter.send(e)
  })

  /**
   * Start Wechaty
   */
  await bootstrapWechaty(wechaty)
}

async function bootstrapWechaty (wechaty: WECHATY.Wechaty): Promise<void> {
  function onScan (qrcode: string, status: WECHATY.ScanStatus) {
    if (status === WECHATY.ScanStatus.Waiting || status === WECHATY.ScanStatus.Timeout) {
      const qrcodeImageUrl = [
        'https://wechaty.js.org/qrcode/',
        encodeURIComponent(qrcode),
      ].join('')
      log.info('XerBot', 'onScan: %s(%s) - %s', WECHATY.ScanStatus[status], status, qrcodeImageUrl)

      qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

    } else {
      log.info('XerBot', 'onScan: %s(%s)', WECHATY.ScanStatus[status], status)
    }
  }

  function onLogin (user: WECHATY.Contact) {
    log.info('XerBot', '%s login', user)
  }

  function onLogout (user: WECHATY.Contact) {
    log.info('XerBot', '%s logout', user)
  }

  function onMessage (message: WECHATY.Message) {
    log.info('XerBot', 'onMessage(%s)', String(message))
  }

  wechaty
    .on('scan', onScan)
    .on('login', onLogin)
    .on('logout', onLogout)
    .on('message', onMessage)

  const future = new Promise<void>(resolve => wechaty.on('stop', resolve))
  await wechaty.start()
  await future

}

await main()
