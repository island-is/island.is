import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'

export const getApplicantStatusConstants = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const currentApplicationId = getValueViaPath(
    answers,
    'externalData.currentApplication.data.currentApplicationId',
  ) as string
  const showCopyUrl = getValueViaPath(
    externalData,
    'sendSpouseEmail.data.success',
  ) as boolean
  const rulesPage = getValueViaPath(
    externalData,
    'municipality.data.rulesHomepage',
  ) as string
  const homepage = getValueViaPath(
    externalData,
    'municipality.data.homepage',
  ) as string
  const email = getValueViaPath(
    externalData,
    'municipality.data.email',
  ) as string
  const rulesHomepage = getValueViaPath(
    externalData,
    'municipality.data.rulesHomepage',
  ) as string

  return {
    currentApplicationId,
    showCopyUrl,
    rulesPage,
    homepage,
    email,
    rulesHomepage,
  }
}
