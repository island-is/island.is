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
  const individualAid = getValueViaPath<Aid>(
    municipalityData,
    'data.individualAid',
  )
  const cohabitationAid = getValueViaPath<Aid>(
    municipalityData,
    'cohabitationAid',
  )

  if (answers) {
    const homeCircumstances = getValueViaPath<HomeCircumstances>(
      answers,
      'homeCircumstances.type',
    )
    const personalTaxCredit = getValueViaPath<ApproveOptions>(
      answers,
      'personalTaxCredit.type',
    )

    return {
      individualAid,
      cohabitationAid,
      homeCircumstances,
      personalTaxCredit,
    }
  }

  return { individualAid, cohabitationAid }
}
