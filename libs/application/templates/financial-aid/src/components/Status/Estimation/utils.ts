import { getValueViaPath } from '@island.is/application/core'
import { DataProviderResult, FormValue } from '@island.is/application/types'
import { Aid, HomeCircumstances } from '@island.is/financial-aid/shared/lib'
import { ApproveOptions } from '../../../lib/types'

export const getEstimationConstants = (
  municipality: DataProviderResult,
  answers?: FormValue,
) => {
  const municipalityData = municipality.data as unknown as Record<
    string,
    unknown
  >
  const individualAid = getValueViaPath(
    municipalityData,
    'data.individualAid',
  ) as Aid
  const cohabitationAid = getValueViaPath(
    municipalityData,
    'cohabitationAid',
  ) as Aid

  if (answers) {
    const homeCircumstances = getValueViaPath(
      answers,
      'homeCircumstances.type',
    ) as HomeCircumstances | undefined
    const personalTaxCredit = getValueViaPath(
      answers,
      'personalTaxCredit.type',
    ) as ApproveOptions | undefined

    return {
      individualAid,
      cohabitationAid,
      homeCircumstances,
      personalTaxCredit,
    }
  }

  return { individualAid, cohabitationAid }
}
