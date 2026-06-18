import { getValueViaPath, YES } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { Fasteign } from '@island.is/clients/assets'

/**
 * In the legacy (client-rendered) app the `FetchPropertiesByCodes` custom
 * component wrote the by-code property lookup into the `anyProperties` answer.
 * In SDF that lookup is a template-api action, so the result lives in
 * externalData under `fetchPropertiesByCode.data` instead.
 */
export const isApplyingForOtherProperty = (answers: FormValue): boolean =>
  !!getValueViaPath<string[]>(
    answers,
    'otherPropertiesThanIOwnCheckbox',
  )?.includes(YES)

export const getSelectedRealEstateId = (
  answers: FormValue,
): string | undefined =>
  isApplyingForOtherProperty(answers)
    ? 'F' + getValueViaPath<string>(answers, 'selectedPropertyByCode')
    : getValueViaPath<string>(answers, 'realEstate')

export const getRelevantProperties = (
  answers: FormValue,
  externalData: ExternalData,
): Array<Fasteign> | undefined =>
  isApplyingForOtherProperty(answers)
    ? getValueViaPath<Array<Fasteign>>(
        externalData,
        'fetchPropertiesByCode.data',
      )
    : getValueViaPath<Array<Fasteign>>(externalData, 'getProperties.data')

// HMS returns `fasteignanumer` with an "F" prefix in some endpoints and
// digits-only in others, and `selectedPropertyByCode` is a bare code. Compare
// on digits only so the lookup is resilient to the prefix instead of relying
// on an exact `'F' + code` match.
const toDigits = (value: string | undefined): string =>
  value?.replace(/\D/g, '') ?? ''

export const getSelectedProperty = (
  answers: FormValue,
  externalData: ExternalData,
): Fasteign | undefined => {
  const selectedRealEstateId = toDigits(getSelectedRealEstateId(answers))
  return getRelevantProperties(answers, externalData)?.find(
    (property) =>
      toDigits(property.fasteignanumer ?? '') === selectedRealEstateId,
  )
}
