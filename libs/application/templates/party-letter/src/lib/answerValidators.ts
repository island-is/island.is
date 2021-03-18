import {
  Application,
  AnswerValidator,
  buildValidationError,
} from '@island.is/application/core'
import { UserCompany } from '../dataProviders/CurrentUserCompanies'

export const PARTY_NATIONAL_ID = 'partyNationalId'

export const answerValidators: Record<string, AnswerValidator> = {
  [PARTY_NATIONAL_ID]: (newAnswer: unknown, application: Application) => {
    /**
     * Party letter can only be assigned to a single national id
     * The national id can be a company or a person
     * Here we make sure applicant manages the national id he is trying to assigning the party letter to
     */
    const newNationalId = newAnswer as string
    const buildError = buildValidationError(PARTY_NATIONAL_ID)

    const userCompanies = application.externalData.userCompanies
      .data as UserCompany[]

    const allowedNationalIds = [
      application.applicant,
      ...userCompanies.map((company) => company.nationalId),
    ]

    if (allowedNationalIds.includes(newNationalId)) {
      return undefined
    } else {
      return buildError('You need to select a valid national id for your party')
    }
  },
}
