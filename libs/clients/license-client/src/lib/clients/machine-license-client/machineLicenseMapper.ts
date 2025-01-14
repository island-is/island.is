import {
  VinnuvelaDto,
  VinnuvelaRettindiDto,
} from '@island.is/clients/adr-and-machine-license'

import format from 'date-fns/format'
import { Locale } from '@island.is/shared/types'
import is from 'date-fns/locale/is'
import enGB from 'date-fns/locale/en-GB'
import { format as formatSsn } from 'kennitala'

const compareDates = (newDate: Date, latestDate?: Date) =>
  !latestDate || newDate > latestDate ? newDate : latestDate

export const findLatestExpirationDate = (license: VinnuvelaDto) => {
  if (!license.vinnuvelaRettindi) {
    return null
  }

  let latestDate: Date | undefined
  for (const right of license.vinnuvelaRettindi) {
    if (right.stjorna) {
      latestDate = compareDates(new Date(right.stjorna), latestDate)
    }
    if (right.kenna) {
      latestDate = compareDates(new Date(right.kenna), latestDate)
    }
  }

  return latestDate ? latestDate.toISOString() : null
}

const formatDateString = (
  dateTime: string,
  dateFormat: string,
  locale?: Locale,
) => {
  const dateLocale = locale === ('en' as Locale) ? enGB : is
  return dateTime
    ? format(new Date(dateTime), dateFormat, { locale: dateLocale })
    : ''
}

export const parseRightsForPkpassInput = (
  rights?: Array<VinnuvelaRettindiDto>,
  locale?: Locale,
) => {
  if (!rights?.length) return 'Engin réttindi'

  const rightsString = rights
    .filter((right) => right.stjorna)
    .map((right) => {
      let candidateString = `${right.flokkur} - ${
        right.stuttHeiti
      }\r\n${formatDateString(right.stjorna ?? '', 'dd.MM.yy', locale)}`
      if (right.kenna) {
        candidateString += `\r\nKennsluréttindi til ${formatDateString(
          right.kenna,
          'dd.MM.yy',
          locale,
        )}`
      }
      return candidateString
    })
    .join('\r\n\r\n')

  return rightsString
}

export const createPkPassDataInput = (
  license: VinnuvelaDto,
  nationalId: string,
  locale?: Locale,
) => {
  if (!license || !nationalId) return null

  return [
    {
      identifier: 'fulltNafn',
      value: license.fulltNafn ?? '',
    },
    {
      identifier: 'skirteinisNumer',
      value: license.skirteinisNumer ?? '',
    },
    {
      identifier: 'kennitala',
      value: nationalId ? formatSsn(nationalId) : '',
    },
    {
      identifier: 'utgafuStadur',
      value: license.utgafuStadur ?? '',
    },
    {
      identifier: 'utgafuLand',
      value: license.utgafuLand ?? '',
    },
    {
      identifier: 'fyrstiUtgafudagur',
      value: license.fyrstiUtgafuDagur
        ? formatDateString(license.fyrstiUtgafuDagur, 'dd. MMMM yyyy', locale)
        : '',
    },
    {
      identifier: 'okuskirteinisnumer',
      //temporary fix until VE make this field optional
      //DO NOT FORGET THIS
      value: license.okuskirteinisNumer ?? '-',
    },
    {
      identifier: 'rettindi',
      value: parseRightsForPkpassInput(license.vinnuvelaRettindi ?? [], locale),
    },
  ]
}
