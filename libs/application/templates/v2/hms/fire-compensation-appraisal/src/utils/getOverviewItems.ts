import {
  AttachmentItem,
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'

import { getValueViaPath } from '@island.is/application/core'
import * as m from '../lib/messages'
import { format as formatKennitala } from 'kennitala'
import { formatPhoneNumber } from './utils'
import { FileType } from '../types'
import { formatCurrency } from '@island.is/shared/utils'
import { getSelectedProperty } from './propertyUtils'
import { sumUsageUnitsFireCompensation } from './sumUtils'

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
  const property = getSelectedProperty(answers, externalData)
  const selectedUsageUnits =
    getValueViaPath<string[]>(answers, 'usageUnits') || []
  const displayUsageUnits = property?.notkunareiningar?.notkunareiningar
    ?.filter((unit) =>
      selectedUsageUnits.includes(unit.notkunareininganumer ?? ''),
    )
    .map((unit) => unit.notkunBirting)

  // `usageUnitsFireCompensation` is an SDF display field, whose computed value is
  // never persisted into answers — so recompute it from source here (same pattern
  // as `getAmountToPay` and the SDF submit mapper) instead of reading the answer.
  const usageUnitsFireCompensation = parseInt(
    sumUsageUnitsFireCompensation(answers, externalData),
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
