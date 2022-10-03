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
import { Locale } from '@island.is/shared/types'
import { i18n } from '../../utils/translations'
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

export const parseMachineLicensePayload = (
  license: VinnuvelaDto,
  locale: Locale = 'is',
): GenericUserLicensePayload | null => {
  if (!license) return null

  const expired: boolean | null = checkLicenseExpirationDate(license)

  const data: Array<GenericLicenseDataField> = [
    {
      name: 'Grunnupplýsingar vinnuvélaskírteinis',
      type: GenericLicenseDataFieldType.Value,
      label: i18n.licenseNumber[locale],
      value: license.skirteinisNumer?.toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: i18n.fullName[locale],
      value: license?.fulltNafn ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: i18n.placeOfIssue[locale],
      value: license.utgafuStadur ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: i18n.firstPublishedDate[locale],
      value: license.fyrstiUtgafuDagur?.toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: i18n.validTo[locale],
      value: i18n.seeRights[locale],
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: i18n.drivingLicenseNumber[locale],
      value: license.okuskirteinisNumer ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Group,
      label: i18n.classesOfRights[locale],
      fields: (license.vinnuvelaRettindi ?? [])
        .filter((field) => field.kenna || field.stjorna)
        .map((field) => ({
          type: GenericLicenseDataFieldType.Category,
          name: field.flokkur ?? '',
          label: field.fulltHeiti ?? field.stuttHeiti ?? '',
          description: field.fulltHeiti ?? field.stuttHeiti ?? '',
          fields: parseVvrRights(field, locale),
        })),
    },
  ]

  return {
    data,
    rawData: JSON.stringify(license),
    metadata: {
      licenseNumber: license.skirteinisNumer?.toString() ?? '',
      expired: expired,
    },
  }
}

const parseVvrRights = (
  rights: VinnuvelaRettindiDto,
  locale: Locale = 'is',
): Array<GenericLicenseDataField> | undefined => {
  const fields = new Array<GenericLicenseDataField>()

  if (rights.stjorna) {
    fields.push({
      type: GenericLicenseDataFieldType.Value,
      label: i18n.control[locale],
      value: rights.stjorna,
    })
  }
  if (rights.kenna) {
    fields.push({
      type: GenericLicenseDataFieldType.Value,
      label: i18n.teach[locale],
      value: rights.kenna,
    })
  }

  return fields?.length ? fields : undefined
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
      value: license.okuskirteinisNumer ?? '',
    },
    {
      identifier: 'rettindi',
      value: parseRightsForPkpassInput(license.vinnuvelaRettindi ?? [], locale),
    },
  ]
}
