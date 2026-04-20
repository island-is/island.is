import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { GaldurDomainModelsSettingsUnemploymentReasonsUnemploymentReasonCatagoryDTO } from '@island.is/clients/vmst-unemployment'

export const getChosenReasonCategory = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const chosenMainReason = getValueViaPath<string>(
    answers,
    'reasonForJobSearch.mainReason',
    '',
  )
  const unemploymentReasonCategories =
    getValueViaPath<
      Array<GaldurDomainModelsSettingsUnemploymentReasonsUnemploymentReasonCatagoryDTO>
    >(
      externalData,
      'unemploymentApplication.data.supportData.unemploymentReasonCategories',
      [],
    ) || []
  return unemploymentReasonCategories.find((x) => x.id === chosenMainReason)
}

export const getReasonsBasedOnChoice = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const chosenCategory = getChosenReasonCategory(answers, externalData)

  return chosenCategory?.unemploymentReasons
}

export const getReasonBasedOnChoice = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const reasons = getReasonsBasedOnChoice(answers, externalData)

  const additionalReason = getValueViaPath<string>(
    answers,
    'reasonForJobSearch.additionalReason',
  )

  const reasonDetails = reasons?.find((x) => x.id === additionalReason)

  return reasonDetails
}
