import { getValueViaPath, YES } from '@island.is/application/core'
import {
  ApplicantAnswer,
  ContactAnswer,
  CVAnswers,
  DrivingLicensesAnswer,
  EducationAnswer,
  JobHistoryAnswer,
  JobWishesAnswer,
  LanguageAnswers,
  PaymentInformationAnswer,
} from '@island.is/application/templates/activation-allowance'
import { ExternalData, FormValue } from '@island.is/application/types'
import {
  GaldurDomainModelsApplicantsApplicantProfileDTOsBankingPensionUnion,
  GaldurDomainModelsApplicantsApplicantProfileDTOsDrivingLicense,
  GaldurDomainModelsApplicantsApplicantProfileDTOsEducation,
  GaldurDomainModelsApplicantsApplicantProfileDTOsJob,
  GaldurDomainModelsApplicantsApplicantProfileDTOsLanguage,
  GaldurDomainModelsApplicantsApplicantProfileDTOsPersonalInformation,
  GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsActivationGrantSupportData,
  GaldurDomainModelsSelectItem,
  GaldurDomainModelsSettingsPostcodesPostcodeDTO,
} from '@island.is/clients/vmst-unemployment'
import { FileResponse } from './types'
import { S3Service } from '@island.is/nest/aws'
import { Locale } from '@island.is/shared/types'

export const parseDateSafe = (dateStr?: string): Date | undefined => {
  if (!dateStr) return undefined

  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? undefined : date
}

export const getApplicantInfo = (
  answers: FormValue,
  externalData: ExternalData,
):
  | GaldurDomainModelsApplicantsApplicantProfileDTOsPersonalInformation
  | undefined => {
  const personalInfo = getValueViaPath<ApplicantAnswer>(answers, 'applicant')

  if (!personalInfo) return undefined

  const {
    nationalId,
    name,
    address,
    city,
    email,
    phoneNumber,
    password,
    isSamePlaceOfResidence,
    other,
  } = personalInfo

  const currentAddressDifferent =
    isSamePlaceOfResidence && isSamePlaceOfResidence.includes(YES)

  let otherPostCodeId = null
  if (currentAddressDifferent) {
    const postCodes = getValueViaPath<
      GaldurDomainModelsSettingsPostcodesPostcodeDTO[]
    >(
      externalData,
      'activityGrantApplication.data.activationGrant.supportData.postCodes',
    )
    otherPostCodeId = postCodes?.find(
      (postCode) => postCode.code === other?.postalCode?.slice(0, 3),
    )
  }

  const result: GaldurDomainModelsApplicantsApplicantProfileDTOsPersonalInformation =
    {
      ssn: nationalId,
      name,
      address,
      city,
      email,
      mobile: phoneNumber,
      passCode: password,
      currentAddressDifferent,
      currentAddress: other?.address,
      currentPostCodeId: otherPostCodeId?.id,
    }

  // Required fields (excluding the two "current" fields)
  const requiredFields = [
    result.ssn,
    result.name,
    result.address,
    result.city,
    result.email,
    result.mobile,
    result.passCode,
    result.currentAddressDifferent,
  ]

  const allRequiredFieldsDefined = requiredFields.every(
    (field) => field !== undefined && field !== null,
  )

  return allRequiredFieldsDefined ? result : undefined
}

export const getContactInfo = (
  answers: FormValue,
): ContactAnswer | undefined => {
  const contact = getValueViaPath<ContactAnswer>(answers, 'contact')

  return contact
}

export const getLicenseInfo = (
  answers: FormValue,
):
  | GaldurDomainModelsApplicantsApplicantProfileDTOsDrivingLicense
  | undefined => {
  const licenses = getValueViaPath<DrivingLicensesAnswer>(
    answers,
    'drivingLicense',
  )

  const payload = {
    hasHeavyMachineryLicense:
      licenses?.hasHeavyMachineryLicense &&
      licenses.hasHeavyMachineryLicense.includes(YES),
    drivingLicenses: licenses?.drivingLicenseType,
    heavyMachineryLicenses: licenses?.heavyMachineryLicenses,
  }
  return payload
}

export const getJobWishesInfo = (
  answers: FormValue,
): { id: string; orderIndex: number }[] | undefined => {
  const jobWishes = getValueViaPath<JobWishesAnswer>(answers, 'jobWishes')
  const jobWishesPayload = (jobWishes?.jobs || []).map((job, index) => {
    return {
      id: job,
      orderIndex: index + 1,
    }
  })
  return jobWishesPayload
}

export const getJobHistoryInfo = (
  answers: FormValue,
): GaldurDomainModelsApplicantsApplicantProfileDTOsJob[] | undefined => {
  const jobHistoryAnswers =
    getValueViaPath<JobHistoryAnswer[]>(answers, 'jobHistory', []) || []
  jobHistoryAnswers
    .map((job) => ({
      employer: job.companyName,
      started: parseDateSafe(job.startDate),
      quit: parseDateSafe(job.endDate),
      jobName: job.jobName,
    }))
    .filter((item) => item.jobName !== null)

  return jobHistoryAnswers
}

export const getBankInfo = (
  answers: FormValue,
  externalData: ExternalData,
):
  | GaldurDomainModelsApplicantsApplicantProfileDTOsBankingPensionUnion
  | undefined => {
  const bankInfo = getValueViaPath<PaymentInformationAnswer>(
    answers,
    'paymentInformation',
  )

  const supportData = getSupportData(externalData)

  const ledgerId = supportData?.ledgers?.find(
    (ledger) => ledger.number === bankInfo?.ledger,
  )?.id
  const bankId = supportData?.banks?.find(
    (bank) => bank.bankNo === bankInfo?.bankNumber,
  )?.id
  const accountNumber = bankInfo?.accountNumber
  if (!ledgerId || !bankId || !accountNumber) return undefined

  return { bankId, ledgerId, accountNumber }
}

export const getLanguageInfo = (
  answers: FormValue,
  externalData: ExternalData,
): GaldurDomainModelsApplicantsApplicantProfileDTOsLanguage[] | undefined => {
  const languageSkillAnswers = getValueViaPath<LanguageAnswers>(
    answers,
    'languageSkills',
  )
  const languageKnowledge = getValueViaPath<GaldurDomainModelsSelectItem[]>(
    externalData,
    'activityGrantApplication.data.activationGrant.supportData.languageKnowledge',
  )
  const languageValues = getValueViaPath<GaldurDomainModelsSelectItem[]>(
    externalData,
    'activityGrantApplication.data.activationGrant.supportData.languageValues',
  )

  const findSkillValue = (key: string) =>
    languageValues?.find((val) => val.id === key)
  const findLanguageValue = (key: string) =>
    languageKnowledge?.find((val) => val.id === key)

  const icelandicAbility = findSkillValue(
    languageSkillAnswers?.icelandicAbility || '',
  )
  const englishAbility = findSkillValue(
    languageSkillAnswers?.englishAbility || '',
  )
  const icelandicLanguage = languageKnowledge?.find(
    (lang) =>
      lang.english === languageSkillAnswers?.icelandic ||
      lang.name === languageSkillAnswers?.icelandic,
  )
  const englishLanguage = languageKnowledge?.find(
    (lang) =>
      lang.english === languageSkillAnswers?.english ||
      lang.name === languageSkillAnswers?.english,
  )

  if (
    !icelandicAbility ||
    !englishAbility ||
    !icelandicLanguage ||
    !englishLanguage
  ) {
    // Indicate error in required data
    return undefined
  }

  const otherLanguagesToDisplay = (languageSkillAnswers?.other ?? [])
    .map((skills) => {
      const languageSkill = findSkillValue(skills.skills || '')
      const languageName = findLanguageValue(skills.language || '')
      if (!languageName?.id || !languageName?.name || !languageSkill?.id)
        return null
      return {
        id: languageName.id,
        name: languageName.name,
        knowledge: languageSkill.id,
      }
    })
    .filter(
      (obj) => obj !== null,
    ) as GaldurDomainModelsApplicantsApplicantProfileDTOsLanguage[]

  const languagesCombined = [
    otherLanguagesToDisplay,
    [
      {
        id: icelandicLanguage.id,
        name: icelandicLanguage.name,
        knowledge: icelandicAbility.id,
      },
      {
        id: englishLanguage.id,
        name: englishLanguage.name,
        knowledge: englishAbility.id,
      },
    ],
  ].flat()

  return languagesCombined
}

export const getSupportData = (
  externalData: ExternalData,
):
  | GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsActivationGrantSupportData
  | undefined => {
  const supportInfo =
    getValueViaPath<GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsActivationGrantSupportData>(
      externalData,
      'activityGrantApplication.data.activationGrant.supportData',
    )
  return supportInfo
}

export const getAcademicInfo = (
  answers: FormValue,
): GaldurDomainModelsApplicantsApplicantProfileDTOsEducation[] | undefined => {
  const education =
    getValueViaPath<EducationAnswer>(answers, 'academicBackground')
      ?.education ?? []

  return education.map((item) => ({
    educationId: item.levelOfStudy, // Nam
    educationSubCategoryId: item.degree, // Profgrada
    educationSubSubCategoryId: item.subject, // namsgrein
    yearFinished:
      item.endOfStudies !== undefined && !isNaN(parseInt(item.endOfStudies))
        ? parseInt(item.endOfStudies)
        : undefined,
  }))
}

export const getCVInfo = async (
  answers: FormValue,
  s3Service: S3Service,
  applicationId: string,
  bucket: string,
): Promise<FileResponse | undefined> => {
  const CV = getValueViaPath<CVAnswers>(answers, 'cv')
  if (!CV || CV.haveCV !== YES) return undefined
  const fileName = CV.cvFile?.file[0].name || ''
  const fileType = getFileExtension(fileName) || ''
  const mimeType = getMimeType(fileType)
  const key = CV.cvFile?.file[0].key || ''
  const other = CV.other

  if (!mimeType || !fileName || !key) return undefined

  try {
    const content = await s3Service.getFileContent(
      {
        bucket: bucket,
        key: `${applicationId}/${key}`,
      },
      'base64',
    )

    const fileResponse: FileResponse = {
      fileName,
      fileType: mimeType,
      data: content || '',
      other: other,
    }
    return fileResponse
  } catch (e) {
    // CV is optional and can be turned in later, so we'd rather return no cv then stop user during submit
    return undefined
  }
}

export const getStartingLocale = (externalData: ExternalData) => {
  return getValueViaPath<Locale>(externalData, 'startingLocale.data')
}

const getMimeType = (fileType: string): string | undefined => {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return 'application/pdf'
    case 'png':
      return 'image/png'
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    default:
      return undefined
  }
}

const getFileExtension = (fileName: string): string | undefined => {
  const parts = fileName.trim().split('.')
  if (parts.length < 2) return undefined // no extension found
  return parts.pop()?.toLowerCase()
}
