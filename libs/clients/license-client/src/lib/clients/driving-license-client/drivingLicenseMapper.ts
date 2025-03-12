import {
  CategoryDto,
  DriverLicenseDto as DriversLicense,
  RemarkCode,
} from '@island.is/clients/driving-license'
import format from 'date-fns/format'
import { info, format as formatSsn } from 'kennitala'

const mapCommentToRemark = (
  commentId: string | null,
  remarks: Array<RemarkCode>,
) => {
  const remark = remarks.find((r) => r.index === commentId)
  return remark?.name ? `${commentId} - ${remark.name}\n` : undefined
}

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

export const nationalIdIndex = 'kennitala'

export const mapNationalId = (nationalId: string) => {
  return {
    identifier: nationalIdIndex,
    value: nationalId ? formatSsn(nationalId) : '',
  }
}

export const createPkPassDataInput = (
  license?: DriversLicense | null,
  remarks?: Array<RemarkCode> | null,
) => {
  if (!license || !license.socialSecurityNumber || !remarks) return null

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
    mapNationalId(license.socialSecurityNumber),
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
