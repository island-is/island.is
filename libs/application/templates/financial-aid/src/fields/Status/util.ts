import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'

export const getApplicantStatusConstants = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const currentApplicationId = getValueViaPath<string>(
    answers,
    'externalData.currentApplication.data.currentApplicationId',
  )
  const showCopyUrl = getValueViaPath<boolean>(
    externalData,
    'sendSpouseEmail.data.success',
  )
  const rulesPage = getValueViaPath<string>(
    externalData,
    'municipality.data.rulesHomepage',
  )
  const homepage = getValueViaPath<string>(
    externalData,
    'municipality.data.homepage',
  )
  const email = getValueViaPath<string>(externalData, 'municipality.data.email')
  const rulesHomepage = getValueViaPath<string>(
    externalData,
    'municipality.data.rulesHomepage',
  )

  return {
    currentApplicationId,
    showCopyUrl,
    rulesPage,
    homepage,
    email,
    rulesHomepage,
  }
}
