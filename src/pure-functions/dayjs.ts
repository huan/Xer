/**
 * Day.js: Fast 2kB alternative to Moment.js with the same modern API
 * @link https://day.js.org/
 */
import dayjs              from 'dayjs'
import relativeTime       from 'dayjs/plugin/relativeTime.js'
import localizedFormat    from 'dayjs/plugin/localizedFormat.js'

/**
 * The zh-cn locale startOfWeek is Monday
 * en-us is Sunday
 */
import 'dayjs/locale/zh-cn.js'
dayjs.locale('zh-cn')

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

export {
  dayjs,
}
