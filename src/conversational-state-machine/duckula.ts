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
import type * as PUPPET     from 'wechaty-puppet'
import * as Mailbox         from 'mailbox'

import * as duck        from '../duck/mod.js'

export interface Context {
  /**
   * Required
   */
  actors: {
    wechaty : string
  }
  /**
   * To-be-filled
   */
  startTime?: number,
  message?  : PUPPET.payloads.Message
}

const duckula = Mailbox.duckularize({
  id: 'DatingPitches',
  events: [ duck.Event, [
    'NEXT',
    'ACCEPT',
    'REJECT',
    'REPLY',
    'MESSAGE',
    'TEXT',
  ] ],
  states: [ duck.State, [
    'Idle',
    'Stranger',
    'Matched',
    'FirstPitched',
    'SecondPitched',
    'ThirdPitched',
    'CoffeeRequested',
    'Success',
    'Failure',
  ] ],
  initialContext: {
    message   : undefined,
    startTime : undefined,
  },
})

export type Event = ReturnType<typeof duckula.Event[keyof typeof duckula.Event]>
export type Events = {
  [key in keyof typeof duckula.Event]: ReturnType<typeof duckula.Event[key]>
}

export default duckula
