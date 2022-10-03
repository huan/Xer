/* eslint-disable no-redeclare */
import * as types from '../types.js'

/**
 * Huan(202204): We are using a "Fancy Enum" instead of a TypeScript native `enum` at here,
 *  because the below tweet from @BenLesh said:
 *
 *  @link https://twitter.com/huan_us/status/1511260462544998404
 */

export type Type = typeof types[keyof typeof types]
export const Type = types
