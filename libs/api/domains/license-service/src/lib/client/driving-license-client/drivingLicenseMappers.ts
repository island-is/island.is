import {
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericUserLicensePayload,
} from '../../licenceService.type'
import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import { getLabel } from '../../utils/translations'
import {
  RemarkCode,
  DriverLicenseDto as DriversLicense,
  CategoryDto,
} from '@island.is/clients/driving-license'
import format from 'date-fns/format'
import { info, format as formatSsn } from 'kennitala'

type ExcludesFalse = <T>(x: T | null | undefined | false | '') => x is T

export const formatNationalId = (nationalId: string) => formatSsn(nationalId)

const mapRemarks = (
  license?: DriversLicense,
  remarks?: Array<RemarkCode> | null,
) => {
  const comments = license?.comments
  if (!comments || !remarks) {
    return
  }
  const commentString = comments.reduce<string>(
    (acc, curr) => `${acc} ${mapCommentToRemark(curr.nr ?? null, remarks)}`,
    '',
  )

  return commentString
}

const mapCommentToRemark = (
  commentId: string | null,
  remarks: Array<RemarkCode>,
) => {
  const remark = remarks.find((r) => r.index === commentId)
  return remark?.name ? `${commentId} - ${remark.name}\n` : undefined
}

const mapCategoryToRight = (
  category: CategoryDto,
  remarks?: Array<RemarkCode> | null,
) => {
  let right = `Réttindaflokkur ${category.nr}, ${
    category.categoryName
  }\n  - Gildir til ${
    category.dateTo ? format(category.dateTo, 'dd-MM-yyyy') : ''
  }\n`

  if (category.comment) {
    const mappedRemark = remarks?.find((r) => r.index === category.comment)
    right +=
      `  - Tákntala: ${category.comment}` +
      `${mappedRemark ? ' - ' + mappedRemark : ''}\n`
  }

  return right
}

const formatRights = (
  categories: Array<CategoryDto> | null,
  remarks?: Array<RemarkCode> | null,
) => {
  if (!categories) {
    return
  }

  const rights = categories.reduce<string>(
    (acc, curr) => `${acc} ${mapCategoryToRight(curr, remarks)}\n`,
    '',
  )

  return rights ?? 'Engin réttindi'
}

export const createPkPassDataInput = (
  license?: DriversLicense | null,
  remarks?: Array<RemarkCode> | null,
) => {
  if (!license || !remarks) return null

  return [
    {
      identifier: 'gildir',
      value: license.dateValidTo
        ? format(license.dateValidTo, 'dd-MM-yyyy')
        : '',
    },
    {
      identifier: 'nafn',
      value: license.name ?? '',
    },
    {
      identifier: 'kennitala',
      value: license.socialSecurityNumber
        ? formatSsn(license.socialSecurityNumber)
        : '',
    },
    {
      identifier: 'faedingardagur',
      value: license.socialSecurityNumber
        ? format(
            info(license.socialSecurityNumber ?? '').birthday,
            'dd-MM-yyyy',
          )
        : '',
    },
    {
      identifier: 'utgafudagur',
      value: license.publishDate
        ? format(license.publishDate, 'dd-MM-yyyy')
        : '',
    },
    {
      identifier: 'numer',
      value: license.id?.toString() ?? '',
    },
    {
      identifier: 'rettindaflokkar',
      value: license.categories
        ? license.categories?.reduce((acc, curr) => `${acc} ${curr.nr}`, '')
        : '',
    },
    {
      identifier: 'rettindi',
      value: formatRights(license.categories ?? null, remarks),
    },
    {
      identifier: 'athugasemdir',
      value: license.comments ? mapRemarks(license, remarks) : '',
    },
  ]
}

export const parseDrivingLicensePayload = (
  license: DriversLicense,
  locale: Locale = 'is',
  labels: GenericLicenseLabels,
): GenericUserLicensePayload | null => {
  if (!license) {
    return null
  }

  const expired = license.dateValidTo
    ? !isAfter(new Date(license.dateValidTo), new Date())
    : null

  const label = labels?.labels

  // Parse license data into the fields as they're displayed on the physical drivers license
  // see: https://www.samgongustofa.is/umferd/nam-og-rettindi/skirteini-og-rettindi/okurettindi-og-skirteini/
  const data = [
    // We don't get the name split into two from the API, combine
    {
      name: getLabel('basicInfoLicense', locale, label),
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('licenseNumber', locale, label),
      value: (license?.id ?? '').toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('fullName', locale, label),
      value: license.name ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('publisher', locale, label),
      value: license.publishPlaceName ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('publishedDate', locale, label),
      value: license.publishDate
        ? new Date(license.publishDate).toISOString()
        : '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('validTo', locale, label),
      value: license.dateValidTo
        ? new Date(license.dateValidTo).toISOString()
        : '',
    },
    {
      type: GenericLicenseDataFieldType.Group,
      label: getLabel('classesOfRights', locale, label),
      fields: (license.categories ?? []).map((field) => ({
        type: GenericLicenseDataFieldType.Category,
        name: (field.nr ?? '').trim(),
        label: '',
        fields: [
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('expiryDate', locale, label),
            value: field.dateTo ? new Date(field.dateTo).toISOString() : '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('publishedDate', locale, label),
            value: field.publishDate
              ? new Date(field.publishDate).toISOString()
              : '',
          },
          field.comment && {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('comment', locale, label),
            value: field.comment,
          },
        ].filter(Boolean as unknown as ExcludesFalse),
      })),
    },
  ]

  return {
    data,
    rawData: JSON.stringify(license),
    metadata: {
      licenseNumber: license.id?.toString() ?? '',
      expired,
      expireDate: license.dateValidTo?.toISOString() ?? undefined,
      links: [
        {
          label: getLabel('renewDrivingLicense', locale, label),
          value: 'https://island.is/endurnyjun-okuskirteina',
        },
      ],
    },
  }
}
