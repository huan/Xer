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
  actions,
  createMachine,
}                           from 'xstate'
import * as Mailbox         from 'mailbox'

import * as CQRS            from 'wechaty-cqrs'

import * as actors from '../actors/mod.js'

import duckula, { Context, Event } from './duckula.js'

const datingPitchesMachine = createMachine<Context, Event>(
  {
    id: duckula.id,
    initial: duckula.State.Idle,
    /**
     * Spawn Worker Actors
     */
    invoke: [
      {
        id: actors.MessageToText.id,
        src: ctx => Mailbox.wrap(
          actors.MessageToText.machine.withContext({
            ...actors.MessageToText.initialContext(),
            actors: {
              wechaty: ctx.actors.wechaty,
            },
          }),
        ),
      },
    ],
    on: {
      [duckula.Type.REPLY]: {
        actions: [
          actions.send(
            (ctx, e) => CQRS.commands.SendMessageCommand(
              CQRS.uuid.NIL,
              ctx.message!.talkerId,
              CQRS.sayables.text(
                `${e.payload.text}`,
              ),
            ),
            { to: ctx => ctx.actors.wechaty },
          ),
        ],
      },
    },
    states: {
      [duckula.State.Idle]: {
        entry: [
          Mailbox.actions.idle(duckula.id),
        ],
        on: {
          [duckula.Type.MESSAGE]: {
            actions: [
              actions.assign({
                message: (_, e) => e.payload.message,
              }),
              actions.send(
                (_, e) => e,
                { to: actors.MessageToText.id },
              ),
            ],
          },
          [actors.MessageToText.Type.TEXT]: {
            actions: [
              actions.log((_, e) => `Got text from MessageToText: ${e.payload.text}`),
            ],
            target: duckula.State.Matched,
          },
        },
      },
      [duckula.State.Matched]: {
        // once matched, send out the first pitch immediately, move to firstPitching state
        entry: [
          actions.send(duckula.Event.REPLY('Hi')),
        ],
        always: duckula.State.FirstPitching,
      },
      [duckula.State.FirstPitching]: {
        entry: [
          actions.send(duckula.Event.REPLY('My name is Xer. How are you?')),
        ],
        // wait for WAITINGTIME
        // if no response, move to failure
        // otherwise, send the second message and move to secondPitching state
        after: {
          6000: duckula.State.Failure,
        },
        on: {
          [duckula.Type.MESSAGE]: {
            actions: [
              actions.assign({
                message: (_, e) => e.payload.message,
              }),
              actions.send(
                (_, e) => e,
                { to: actors.MessageToText.id },
              ),
            ],
          },
          [actors.MessageToText.Type.TEXT]: {
            actions: [
              actions.log((_, e) => `Got text from MessageToText: ${e.payload.text}`),
            ],
            target: duckula.State.SecondPitching,
          },
        },
      },
      [duckula.State.SecondPitching]: {
        entry: [
          actions.send(duckula.Event.REPLY('How is your day?')),
        ],
        // wait for WAITINGTIME
        // if no response, move to failure
        // otherwise, send coffee meet request and move to coffeeRequested state
        after: {
          6000: duckula.State.Failure,
        },
        on: {
          [duckula.Type.MESSAGE]: {
            actions: [
              actions.assign({
                message: (_, e) => e.payload.message,
              }),
              actions.send(
                (_, e) => e,
                { to: actors.MessageToText.id },
              ),
            ],
          },
          [actors.MessageToText.Type.TEXT]: {
            actions: [
              actions.log((_, e) => `Got text from MessageToText: ${e.payload.text}`),
            ],
            target: duckula.State.CoffeeRequesting,
          },
        },
      },
      [duckula.State.CoffeeRequesting]: {
        entry: [
          actions.send(duckula.Event.REPLY('Do you wanna grab coffee some day?')),
        ],
        // wait for WAITINGTIME
        // if no response, move to failure
        // else if request is rejected, move to failure
        // otherwise, move to success
        after: {
          6000: {
            actions: [
              actions.log('No response to coffee request'),
              actions.send(duckula.Event.REJECT()),
            ],
          },
        },
        on: {
          [duckula.Type.MESSAGE]: {
            actions: [
              actions.assign({
                message: (_, e) => e.payload.message,
              }),
              actions.send(
                (_, e) => e,
                { to: actors.MessageToText.id },
              ),
            ],
          },
          [actors.MessageToText.Type.TEXT]: {
            actions: [
              actions.log((_, e) => `Got text from MessageToText: ${e.payload.text}`),
              actions.send(duckula.Event.ACCEPT()),
            ],
          },
          [duckula.Type.REJECT]: { target: duckula.State.Failure },
          [duckula.Type.ACCEPT]: { target: duckula.State.Success },
        },
      },
      [duckula.State.Success]: {
        entry: [
          actions.send(duckula.Event.REPLY('Great, I feel some chemistry between us!')),
        ],
        type: 'final',
      },
      [duckula.State.Failure]: {
        entry: [
          actions.send(duckula.Event.REPLY('Sorry, I think we are done.')),
        ],
      },
    },
  },
)

export default datingPitchesMachine
