import { AttachmentItem, ExternalData } from '@island.is/application/types'

import { FormValue } from '@island.is/application/types'

import { getValueViaPath } from '@island.is/application/core'
import { KeyValueItem } from '@island.is/application/types'
import * as m from '../lib/messages'
import { format as formatKennitala } from 'kennitala'
import { formatPhoneNumber } from './utils'
import { FileType } from '../types'
import { Fasteign } from '@island.is/clients/assets'
import { formatCurrency } from '@island.is/shared/utils'

export const personalInformationOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: m.overviewMessages.name,
      valueText: getValueViaPath<string>(answers, 'applicant.name') ?? '',
    },
    {
      width: 'half',
      keyText: m.overviewMessages.nationalId,
      valueText: formatKennitala(
        getValueViaPath<string>(answers, 'applicant.nationalId') ?? '',
      ),
    },
    {
      width: 'half',
      keyText: m.overviewMessages.address,
      valueText: getValueViaPath<string>(answers, 'applicant.address') ?? '',
    },
    {
      width: 'half',
      keyText: m.overviewMessages.postalCode,
      valueText: getValueViaPath<string>(answers, 'applicant.postalCode') ?? '',
    },
    {
      width: 'half',
      keyText: m.overviewMessages.city,
      valueText: getValueViaPath<string>(answers, 'applicant.city') ?? '',
    },
    {
      width: 'half',
      keyText: m.overviewMessages.email,
      valueText: getValueViaPath<string>(answers, 'applicant.email') ?? '',
    },
    {
      width: 'half',
      keyText: m.overviewMessages.phoneNumber,
      valueText: formatPhoneNumber(
        getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
      ),
    },
  ]
}

export const changesOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'half',
      keyText: m.changesMessages.becauseOfRenovations,
      valueText: getValueViaPath<string>(answers, 'appraisalMethod')?.includes(
        'renovations',
      )
        ? m.miscMessages.yes
        : m.miscMessages.no,
    },
    {
      width: 'half',
      keyText: m.changesMessages.becauseOfAdditions,
      valueText: getValueViaPath<string>(answers, 'appraisalMethod')?.includes(
        'additions',
      )
        ? m.miscMessages.yes
        : m.miscMessages.no,
    },
    {
      width: 'full',
      keyText: m.changesMessages.descriptionOfChanges,
      valueText: getValueViaPath<string>(answers, 'description') ?? '',
    },
  ]
}

export const realEstateOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const realEstateId = getValueViaPath<string>(answers, 'realEstate')
  const properties = getValueViaPath<Array<Fasteign>>(
    externalData,
    'getProperties.data',
  )
  const property = properties?.find(
    (property) => property.fasteignanumer === realEstateId,
  )
  const selectedUsageUnits =
    getValueViaPath<string[]>(answers, 'usageUnits') || []
  const displayUsageUnits = property?.notkunareiningar?.notkunareiningar
    ?.filter((unit) =>
      selectedUsageUnits.includes(unit.notkunareininganumer ?? ''),
    )
    .map((unit) => unit.notkunBirting)

  const usageUnitsFireCompensation = parseInt(
    getValueViaPath<string>(answers, 'usageUnitsFireCompensation') ?? '0',
  )

  return [
    {
      width: 'half',
      keyText: m.overviewMessages.address,
      valueText: property?.sjalfgefidStadfang?.birting ?? '',
    },
    {
      width: 'half',
      keyText: m.overviewMessages.realEstateId,
      valueText: property?.fasteignanumer ?? '',
    },
    {
      width: 'half',
      keyText: m.overviewMessages.usageUnits,
      valueText: displayUsageUnits?.join(', ') ?? '',
    },
    {
      width: 'half',
      keyText: m.realEstateMessages.usageUnitsFireCompensation,
      valueText: formatCurrency(usageUnitsFireCompensation),
    },
  ]
}

export const photoOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<AttachmentItem> => {
  const photos = getValueViaPath<Array<FileType>>(answers, 'photos')

  return (
    photos?.map((photo) => ({
      width: 'full',
      fileName: photo.name,
      fileType: photo.name.split('.').pop(),
    })) ?? []
  )
}
