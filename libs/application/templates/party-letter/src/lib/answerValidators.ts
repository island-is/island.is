import {
  Application,
  AnswerValidator,
  AnswerValidationError,
  Answer,
} from '@island.is/application/core'
import isNumber from 'lodash/isNumber'
import { UserCompany } from '../dataProviders/CurrentUserCompanies'

const buildValidationError = (
  path: string,
  index?: number,
): ((message: string, field?: string) => AnswerValidationError) => (
  message,
  field,
) => {
  if (field && isNumber(index)) {
    return {
      message,
      path: `${path}[${index}].${field}`,
    }
  }

  return {
    message,
    path,
  }
}

const PARTY_NATIONAL_ID = 'partyNationalId'

export const answerValidators: Record<string, AnswerValidator> = {
  [PARTY_NATIONAL_ID]: (newAnswer: unknown, application: Application) => {
    /**
     * Party letter can only be assigned to a single national id
     * The national id can be a company or a person
     * Here we make sure you manage the national id you are assigning the letter to
     */
    const newNationalId = newAnswer as string
    const buildError = buildValidationError(PARTY_NATIONAL_ID)

    const userCompanies = application.externalData.userCompanies
      .data as UserCompany[]

    const allowedNationalIds = [
      application.applicant,
      ...userCompanies.map((company) => company.Kennitala),
    ]

    console.log(allowedNationalIds)

    if (allowedNationalIds.includes(newNationalId)) {
      return undefined
    } else {
      return buildError('You need to select a valid national id for your party')
    }
  },
}
