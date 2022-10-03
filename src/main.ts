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
  createMachine,
  interpret,
}                   from 'xstate'

import duckula from './conversational-state-machine/duckula.js'

const datingPitchesMachine = createMachine(
  {
    id: duckula.id,
    context: duckula.initialContext,
    initial: duckula.State.Matched,
    states: {
      [duckula.State.Matched]: {
        // once matched, send out the first pitch immediately, move to firstPitched state
        always:[ { target: duckula.State.FirstPitched } ],
        entry: [ 'sendFirstPitch' ],
      },
      [duckula.State.FirstPitched]: {
        // wait for WAITINGTIME
        // if no response, move to failure
        // otherwise, send the second message and move to secondPitched state
        after: {
          6000: duckula.State.Failure,
        },
        on: {
          REPLY: {
            actions: [ 'sendSecondPitch' ],
            target: duckula.State.SecondPitched,
          },
        },
      },
      [duckula.State.SecondPitched]: {
        // wait for WAITINGTIME
        // if no response, move to failure
        // otherwise, send coffee meet request and move to coffeeRequested state
        after: {
          6000: duckula.State.Failure,
        },
        on: {
          REPLY: { target: duckula.State.CoffeeRequested, actions: [ 'requestCoffeeMeet' ] },
        },
      },
      [duckula.State.CoffeeRequested]: {
        // wait for WAITINGTIME
        // if no response, move to failure
        // else if request is rejected, move to failure
        // otherwise, move to success
        after: {
          6000: duckula.State.Failure,
        },
        on: {
          REJECT: { target: duckula.State.Failure },
          ACCEPT: { target: duckula.State.Success },
        },
      },
      [duckula.State.Success]: { type: 'final' },
      [duckula.State.Failure]: {},
    },
  },
  {
    actions: {
      // action implementations
      sendFirstPitch: (_context, _event) => {
        console.info('Hi, my name is Xer. How are you?')
      },
      sendSecondPitch: (_context, _event) => {
        console.info('How is your day?')
      },
      requestCoffeeMeet: (_context, _event) => {
        console.info('Do you wanna grab coffee some day?')
      },
    },
  },
)

const datingPitchesService = interpret(datingPitchesMachine).onTransition((state) =>
  console.info('Current state <%s>', state.value),
)

// Start the service
datingPitchesService.start()
// => 'matched'

datingPitchesService.send({ type: 'REPLY' })

datingPitchesService.send({ type: 'REPLY' })

datingPitchesService.send({ type: 'ACCEPT' })
