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

/**
 * System States
 */
export const Idle         = 'sys/Idle'
export const Responding   = 'sys/Responding'
export const Erroring     = 'sys/Erroring'

export const Messaging    = 'sys/Messaging'
export const Initializing = 'sys/Initializing'
export const Filing       = 'sys/Filing'
export const Recognizing  = 'sys/Recognizing'
export const Recognized   = 'sys/Recognized'
export const Classifying  = 'sys/Classifying'
export const Textualized  = 'sys/Textualized'

/**
 * Xer (Domain) States
 */
export const Stranger   = 'xer/Stranger'
export const Matched    = 'xer/Matched'

export const FirstPitching     = 'xer/FirstPitching'
export const SecondPitching    = 'xer/SecondPitching'
export const ThirdPitching     = 'xer/ThirdPitching'

export const CoffeeRequesting  = 'xer/CoffeeRequesting'

export const Success  = 'xer/Success'
export const Failure  = 'xer/Failure'
