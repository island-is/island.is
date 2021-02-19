import get from 'lodash/get'
import { logger } from '@island.is/logging'

import { Application } from '@island.is/application/core'
import { VistaSkjalInput } from '@island.is/api/domains/health-insurance'

const extractAnswer = <T>(object: unknown, key: string): T | null => {
  const value = get(object, key, null) as T | null | undefined
  if (value === undefined || value === null) {
    return null
  }
  return value
}

const extractAnswerFromJson = (object: unknown, key: string) => {
  const value: string | null = extractAnswer(object, key)
  if (value === undefined || value === null) {
    return null
  }
  return JSON.parse(value)
}

export const transformApplicationToHealthInsuranceDTO = (
  application: Application,
): VistaSkjalInput => {
  logger.info(`Start transform Application to Health Insurance DTO`)
  /*
   * Convert userStatus:
   * employed: 'O'
   * pensioner: 'P'
   * student: 'S'
   * other: 'O'
   */
  let userStatus = ''
  switch (extractAnswer(application.answers, 'status')) {
    case 'pensioner':
      userStatus = 'P'
      break
    case 'student':
      userStatus = 'S'
      break
    default:
      userStatus = 'O'
      break
  }

  // Extract attachments
  const arrFiles: string[] = Object.keys(application.attachments) ?? []
  if (userStatus == 'S' && arrFiles.length <= 0) {
    throw new Error(
      `Student's application must have confirmation of student document`,
    )
  }

  return {
    applicationNumber: application.id,
    applicationDate: application.modified,
    nationalId: application.applicant,
    foreignNationalId:
      extractAnswer(application.answers, 'formerInsurance.personalId') ?? '',
    name: extractAnswer(application.answers, 'applicant.name') ?? '',
    address:
      extractAnswer(application.answers, 'applicant.address') ?? undefined,
    postalAddress:
      extractAnswer(application.answers, 'applicant.postalCode') ?? undefined,
    citizenship:
      extractAnswer(application.answers, 'applicant.citizenship') ?? undefined,
    email: extractAnswer(application.answers, 'applicant.email') ?? '',
    phoneNumber:
      extractAnswer(application.answers, 'applicant.phoneNumber') ?? '',
    // TODO: Get from frontend when ready
    // application.externalData.nationalRegistry.data.address.lastUpdated
    residenceDateFromNationalRegistry: new Date(Date.now()),
    // TODO: Get from frontend when ready
    residenceDateUserThink: new Date(Date.now()),
    userStatus: userStatus,
    isChildrenFollowed:
      extractAnswer(application.answers, 'children') == 'no' ? 0 : 1,
    previousCountry:
      extractAnswerFromJson(application.answers, 'formerInsurance.country')
        .name ?? '',
    previousCountryCode:
      extractAnswerFromJson(application.answers, 'formerInsurance.country')
        .countryCode ?? '',
    previousIssuingInstitution:
      extractAnswer(application.answers, 'formerInsurance.institution') ?? '',
    isHealthInsuredInPreviousCountry:
      extractAnswer(application.answers, 'formerInsurance.entitlement') == 'yes'
        ? 1
        : 0,
    // TODO: additionalRemarks
    additionalInformation:
      extractAnswer(application.answers, 'additionalInfo.remarks') ?? '',
    attachmentsFileNames: arrFiles.toString(),
  }
}
