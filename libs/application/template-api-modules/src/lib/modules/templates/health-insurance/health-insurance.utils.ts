import get from 'lodash/get'
import { Application } from '@island.is/application/core'

import { VistaSkjalInput } from '@island.is/api/domains/health-insurance'

const extractAnswer = <T>(object: unknown, key: string): T | null => {
  const value = get(object, key, null) as T | null | undefined

  if (value === undefined || value === null) {
    throw new Error('Could not send application')
  }

  return value
}

const extractAnswerWithJson = (object: unknown, key: string) => {
  const value: string | null = extractAnswer(object, key)
  if (value === undefined || value === null){
    throw new Error('Could not send application')
  }
  return JSON.parse(value)
}

export const transformApplicationToHealthInsuranceDTO = (
  application: Application,
): VistaSkjalInput => {
  /*
    * Convert userStatus:
    * employed: 'O'
    * pensioner: 'P'
    * student: 'S'
    * other: 'O'
  */
  let userStatus = ''
  switch (extractAnswer(application.answers,'status')){
    case 'pensioner':
      userStatus = 'P'
    case 'student':
      userStatus = 'S'
    default:
      userStatus = 'O'
  } 

  return {
    applicationNumber: application.id,
    applicationDate: application.modified,
    nationalId: application.applicant,
    foreignNationalId: extractAnswer(application.answers, 'formerInsurance.personalId') ?? '',
    name: extractAnswer(application.answers,'applicant.name') ?? '',
    address: extractAnswer(application.answers, 'applicant.address') ?? undefined,
    postalAddress: extractAnswer(application.answers, 'applicant.postalCode') ?? undefined,
    citizenship: extractAnswer(application.answers, 'applicant.nationality') ?? undefined,
    email: extractAnswer(application.answers, 'applicant.email') ?? '',
    phoneNumber:extractAnswer(application.answers, 'applicant.phoneNumber') ?? '',
    // TODO: Get from frontend when ready
    residenceDateFromNationalRegistry: new Date(Date.now()),
    // TODO: Get from frontend when ready
    residenceDateUserThink: new Date(Date.now()),
    userStatus: userStatus,
    isChildrenFollowed: extractAnswer(application.answers, 'children') == 'no' ? 0 : 1,
    previousCountry: extractAnswerWithJson(application.answers, 'formerInsurance.country').name ?? '',
    previousCountryCode: extractAnswerWithJson(application.answers, 'formerInsurance.country').countryCode ?? '',
    previousIssuingInstitution: extractAnswer(application.answers, 'formerInsurance.institution') ?? '',
    isHealthInsuredInPreviousCountry: extractAnswer(application.answers, 'formerInsurance.institution') == 'yes' ? 1 : 0,
    additionalInformation: extractAnswer(application.answers, 'additionalInfo.remarks') ?? ''
    // TODO: Add files/attachments
  }
}
