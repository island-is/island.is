import get from 'lodash/get'
import { Application } from '@island.is/application/core'

const extractAnswer = <T>(object: unknown, key: string): T | null => {
  const value = get(object, key, null) as T | null | undefined
  if (value === undefined || value === null) {
    return null
  }
  return value
}

const extractAnswerFromJson = (object: unknown, key: string) => {
  const value: string | null = extractAnswer(object, key)
  if (value === undefined || value === null){
    return null
  }
  return JSON.parse(value)
}

// const extractAttachmentFiles = (files: object[]) => {
//   const arrFiles: string[] = []
//   files.forEach(file =>{
//     const filename = extractAnswer(file, 'name')
//     if (filename && typeof filename === 'string'){
//       arrFiles.push(filename)
//     }
//   })
//   return arrFiles
// }

export const transformApplicationToHealthInsuranceDTO = (
  application: Application,
): string => {
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
      break
    case 'student':
      userStatus = 'S'
      break
    default:
      userStatus = 'O'
      break
  }

  // Extract additional attachments
  // const addFiles = extractAnswer(application.answers,'additionalInfo.files')
  // let arrFiles: string[] = []
  // if (Array.isArray(addFiles)){
  //   arrFiles =  extractAttachmentFiles(addFiles)
  // }
  
  // // Extract confirmation of students
  // if (userStatus == 'S'){
  //   const confirmStudent = extractAnswer(application.answers,'confirmationOfStudies')
  //   if (confirmStudent && Array.isArray(confirmStudent)){
  //     const studentFiles = extractAttachmentFiles(confirmStudent)
  //     arrFiles = arrFiles.concat(studentFiles)
  //   }
  //   else{
  //     throw new Error(`Student's application must have confirmation of student document`)
  //   }
  // }

  // Extract attachments
  const arrFiles: string[] = Object.keys(application.attachments) ?? []
  if ( userStatus == 'S' && arrFiles.length <= 0){
    throw new Error(`Student's application must have confirmation of student document`)
  }

  // TODO: upgrade 'residenceDateFromNationalRegistry' and 'residenceDateUserThink'
  //       when frontend ready
  return `mutation {
    healthInsuranceApplyInsurance(
    inputs: {
      applicationNumber: "${application.id}",
      applicationDate: "${application.modified}",
      nationalId: "${application.applicant}",
      foreignNationalId: "${extractAnswer(application.answers, 'formerInsurance.personalId') ?? ''}",
      name: "${extractAnswer(application.answers,'applicant.name') ?? ''}",
      address: "${extractAnswer(application.answers, 'applicant.address') ?? undefined}",
      postalAddress: "${extractAnswer(application.answers, 'applicant.postalCode') ?? undefined}",
      citizenship: "${extractAnswer(application.answers, 'applicant.nationality') ?? undefined}",
      email: "${extractAnswer(application.answers, 'applicant.email') ?? ''}",
      phoneNumber:"${extractAnswer(application.answers, 'applicant.phoneNumber') ?? ''}",
      residenceDateFromNationalRegistry: "${new Date(Date.now())}",
      residenceDateUserThink: "${new Date(Date.now())}",
      userStatus: "${userStatus}",
      isChildrenFollowed: ${extractAnswer(application.answers, 'children') == 'no' ? 0 : 1},
      previousCountry: "${extractAnswerFromJson(application.answers, 'formerInsurance.country').name ?? ''}",
      previousCountryCode: "${extractAnswerFromJson(application.answers, 'formerInsurance.country').countryCode ?? ''}",
      previousIssuingInstitution: "${extractAnswer(application.answers, 'formerInsurance.institution') ?? ''}",
      isHealthInsuredInPreviousCountry: ${extractAnswer(application.answers, 'formerInsurance.entitlement') == 'yes' ? 1 : 0},
      additionalInformation: "${extractAnswer(application.answers, 'additionalInfo.remarks') ?? ''}",
    }) {
      isSucceeded,
      caseId,
      comment
    }
  }`
// {
//     applicationNumber: application.id,
//     applicationDate: application.modified,
//     nationalId: application.applicant,
//     foreignNationalId: extractAnswer(application.answers, 'formerInsurance.personalId') ?? '',
//     name: extractAnswer(application.answers,'applicant.name') ?? '',
//     address: extractAnswer(application.answers, 'applicant.address') ?? undefined,
//     postalAddress: extractAnswer(application.answers, 'applicant.postalCode') ?? undefined,
//     citizenship: extractAnswer(application.answers, 'applicant.nationality') ?? undefined,
//     email: extractAnswer(application.answers, 'applicant.email') ?? '',
//     phoneNumber:extractAnswer(application.answers, 'applicant.phoneNumber') ?? '',
//     // TODO: Get from frontend when ready
//     residenceDateFromNationalRegistry: new Date(Date.now()),
//     // TODO: Get from frontend when ready
//     residenceDateUserThink: new Date(Date.now()),
//     userStatus: userStatus,
//     isChildrenFollowed: extractAnswer(application.answers, 'children') == 'no' ? 0 : 1,
//     previousCountry: extractAnswerFromJson(application.answers, 'formerInsurance.country').name ?? '',
//     previousCountryCode: extractAnswerFromJson(application.answers, 'formerInsurance.country').countryCode ?? '',
//     previousIssuingInstitution: extractAnswer(application.answers, 'formerInsurance.institution') ?? '',
//     isHealthInsuredInPreviousCountry: extractAnswer(application.answers, 'formerInsurance.entitlement') == 'yes' ? 1 : 0,
//     additionalInformation: extractAnswer(application.answers, 'additionalInfo.remarks') ?? '',
//     attachmentsFileNames: arrFiles,
//   }
}
