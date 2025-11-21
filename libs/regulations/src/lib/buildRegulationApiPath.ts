import { ISODate, RegQueryName } from '@dmr.is/regulations-tools/types'
import { RegulationViewTypes, RegulationOriginalDates } from './types-web'

export const buildRegulationApiPath = (opts: {
  viewType: RegulationViewTypes
  name: RegQueryName
  date?: ISODate
  isCustomDiff?: boolean
  earlierDate?: ISODate | RegulationOriginalDates
}): string => {
  const { viewType, name, date, isCustomDiff } = opts

  const earlierDate =
    opts.earlierDate === RegulationOriginalDates.gqlHack
      ? RegulationOriginalDates.api
      : opts.earlierDate

  let pathParams: string = viewType

  if (viewType === 'd') {
    if (date) {
      pathParams = 'd/' + date
      if (isCustomDiff) {
        pathParams += '/diff' + (earlierDate ? '/' + earlierDate : '')
      }
    } else {
      // Treat `viewType` 'd' with no `date` as 'current'
      // ...either that or throwing an error...
      // ...or tightening the type signature to prevent that happening.
      pathParams = 'current'
    }
  }
  return `/regulation/${name}/${pathParams}`
}
