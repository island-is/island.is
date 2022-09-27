import {
  VinnuvelaDto,
  VinnuvelaRettindiDto,
} from '@island.is/clients/adr-and-machine-license'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericUserLicensePayload,
} from '../../licenceService.type'

import format from 'date-fns/format'
import isAfter from 'date-fns/isAfter'
import is from 'date-fns/locale/is'
import enGB from 'date-fns/locale/en-GB'
import { format as formatSsn } from 'kennitala'
import { Locale } from 'locale'

const checkLicenseExpirationDate = (license: VinnuvelaDto) => {
  return license.vinnuvelaRettindi
    ? license.vinnuvelaRettindi
        .filter((field) => field.kenna || field.stjorna)
        .every(
          (field: VinnuvelaRettindiDto) =>
            field.kenna &&
            !isAfter(new Date(field.kenna), new Date()) &&
            field.stjorna &&
            !isAfter(new Date(field.stjorna), new Date()),
        )
    : null
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

export const parseMachineLicensePayload = (
  license: VinnuvelaDto,
): GenericUserLicensePayload | null => {
  if (!license) return null

  const data: Array<GenericLicenseDataField> = [
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Skírteini nr. ',
      value: license.skirteinisNumer?.toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '1. Fullt nafn',
      value: license?.fulltNafn ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '2. Kennitala',
      value: license.kennitala ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '3. Útgáfustaður',
      value: license.utgafuStadur ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '4. Útgáfudagur',
      value: license.fyrstiUtgafuDagur?.toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '5. Gildir til.',
      value: 'Sjá réttindi',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '6. Ökuskírteini nr',
      value: license.okuskirteinisNumer ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Group,
      label: 'Réttindaflokkar',
      fields: (license.vinnuvelaRettindi ?? [])
        .filter((field) => field.kenna || field.stjorna)
        .map((field) => ({
          type: GenericLicenseDataFieldType.Category,
          name: field.flokkur ?? '',
          label: field.fulltHeiti ?? field.stuttHeiti ?? '',
          fields: parseVvrRights(field),
        })),
    },
  ]

  return {
    data,
    rawData: JSON.stringify(license),
  }
}

const parseVvrRights = (
  rights: VinnuvelaRettindiDto,
): Array<GenericLicenseDataField> | undefined => {
  const fields = new Array<GenericLicenseDataField>()

  if (rights.stjorna) {
    fields.push({
      type: GenericLicenseDataFieldType.Value,
      label: 'Stjórna',
      value: rights.stjorna,
    })
  }
  if (rights.kenna) {
    fields.push({
      type: GenericLicenseDataFieldType.Value,
      label: 'Kenna',
      value: rights.kenna,
    })
  }

  return fields?.length ? fields : undefined
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
      value: license.okuskirteinisNumer ?? '',
    },
    {
      identifier: 'rettindi',
      value: parseRightsForPkpassInput(license.vinnuvelaRettindi ?? [], locale),
    },
  ]
}
