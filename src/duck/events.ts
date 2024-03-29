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
import { createAction }         from 'typesafe-actions'
import type * as PUPPET         from 'wechaty-puppet'
import type { AnyEventObject }  from 'xstate'

import type { Intent }    from '../intents/mod.js'

import { Type }   from './fancy-enum/type.js'

const payloadOptionalMessage = (message?: PUPPET.payloads.Message) => ({ message })

const payloadAbort     = (reason: string) => ({ reason })
const payloadCancel    = (reason: string) => ({ reason })
const payloadData      = (data?: string) => ({ data })

const payloadMentions = (contacts: [PUPPET.payloads.Contact, ...PUPPET.payloads.Contact[]], message: PUPPET.payloads.Message) => ({ contacts, message })
export const MENTIONS     = createAction(Type.MENTIONS,   payloadMentions)()
export const NO_MENTION   = createAction(Type.NO_MENTION, payloadOptionalMessage)()

const payloadContacts   = (contacts: PUPPET.payloads.Contact[])  => ({ contacts })
export const CONTACTS   = createAction(Type.CONTACTS,  payloadContacts)()
export const NO_CONTACT  = createAction(Type.NO_CONTACT)()
export const ADD_CONTACT = createAction(Type.ADD_CONTACT, payloadContacts)()

export const ATTENDEES  = createAction(Type.ATTENDEES, payloadContacts)()
export const ADMINS     = createAction(Type.ADMINS,    payloadContacts)()
export const CHAIRS     = createAction(Type.CHAIRS,    payloadContacts)()

const payloadMessage  = (message: PUPPET.payloads.Message) => ({ message })
export const MESSAGE  = createAction(Type.MESSAGE, payloadMessage)()

export const BACK        = createAction(Type.BACK)()
export const NEXT        = createAction(Type.NEXT)()

export const NO_AUDIO    = createAction(Type.NO_AUDIO)()

const payloadRoom = (room: PUPPET.payloads.Room, message?: PUPPET.payloads.Message) => ({ message, room })
export const ROOM = createAction(Type.ROOM, payloadRoom)()

const payloadNoRoom = (message?: PUPPET.payloads.Message) => ({ message })
export const NO_ROOM = createAction(Type.NO_ROOM, payloadNoRoom)()

export const START       = createAction(Type.START)()
export const STOP        = createAction(Type.STOP)()

const  payloadText   = (text: string, message?: PUPPET.payloads.Message) => ({ message, text })
export const TEXT    = createAction(Type.TEXT,    payloadText)()
export const NO_TEXT = createAction(Type.NO_TEXT, payloadOptionalMessage)()

const payloadFeedbacks  = (feedbacks: { [contactId: string]: string }) => ({ feedbacks })
export const FEEDBACKS    = createAction(Type.FEEDBACKS, payloadFeedbacks)()

// const payloadFeedback = (feedback: string, message: PUPPET.payloads.Message) => ({ feedback, message })
// export const FEEDBACK = createAction(Type.FEEDBACK, payloadFeedback)()

export const CANCEL  = createAction(Type.CANCEL, payloadCancel)()
export const ABORT  = createAction(Type.ABORT, payloadAbort)()

const payloadGerror = (gerror: string) => ({ gerror })
export const GERROR = createAction(Type.GERROR, payloadGerror)()

const payloadReset  = (data?: string) => ({ data })
export const RESET  = createAction(Type.RESET, payloadReset)()

const payloadIntents = (intents: readonly Intent[], message?: PUPPET.payloads.Message) => ({ intents, message })
export const INTENTS = createAction(Type.INTENTS, payloadIntents)()

/**
 * Complete v.s. Finish
 *  @see https://ejoy-english.com/blog/complete-vs-finish-similar-but-different/
 */
export const FINISH   = createAction(Type.FINISH, payloadData)()
export const COMPLETE = createAction(Type.COMPLETE, payloadData)()

export const HELP  = createAction(Type.HELP)()
export const REPORT     = createAction(Type.REPORT)()

const payloadIdle = (data?: string) => ({ reason: data })
export const IDLE = createAction(Type.IDLE, payloadIdle)()

export const CHECK = createAction(Type.CHECK)()

export const PROCESS = createAction(Type.PROCESS)()
export const PARSE = createAction(Type.PARSE)()

const payloadNotice = (text: string, mentions: string[] = []) => ({ mentions, text })
export const NOTICE = createAction(Type.NOTICE, payloadNotice)()

/**
 * Minutes of Meeting (MoM)
 *  @link https://en.wikipedia.org/wiki/Minutes
 */
const payloadMinute = (minutes: string) => ({ minutes })
export const MINUTES = createAction(Type.MINUTES, payloadMinute)()

const payloadConversation = (id: string) => ({ id })
export const CONVERSATION = createAction(Type.CONVERSATION, payloadConversation)()

export const NOP = createAction(Type.NOP)()

const payloadFile  = (box: string, message?: PUPPET.payloads.Message) => ({ box, message })
export const FILE = createAction(Type.FILE, payloadFile)()

const payloadNoFile  = (message?: PUPPET.payloads.Message) => ({ message })
export const NO_FILE = createAction(Type.NO_FILE, payloadNoFile)()

const payloadLoad = (id: string) => ({ id })
export const LOAD = createAction(Type.LOAD, payloadLoad)()

export const REGISTER = createAction(Type.REGISTER)()

export const TEST = createAction(Type.TEST)()
export const VALIDATE = createAction(Type.VALIDATE)()

export const payloadBatch = (events: AnyEventObject[]) => ({ events })
export const BATCH = createAction(Type.BATCH, payloadBatch)()

export const payloadDates = (timestamps: number[], message?: PUPPET.payloads.Message) => ({ message, timestamps })
export const DATES     = createAction(Type.DATES, payloadDates)()

export const payloadDate = (timestamp: number, message?: PUPPET.payloads.Message) => ({ message, timestamp })
export const DATE     = createAction(Type.DATE, payloadDate)()
export const NO_DATE  = createAction(Type.NO_DATE)()

export const MEMBERS    = createAction(Type.MEMBERS, payloadContacts)()
export const NO_MEMBER  = createAction(Type.NO_MEMBER)()

export const REPLY   = createAction(Type.REPLY, payloadText)()
export const ACCEPT  = createAction(Type.ACCEPT)()
export const REJECT  = createAction(Type.REJECT)()
