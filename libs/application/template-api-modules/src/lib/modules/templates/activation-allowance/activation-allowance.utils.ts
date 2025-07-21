import { getValueViaPath, YES } from '@island.is/application/core'
import {
  ApplicantAnswer,
  ContactAnswer,
  DrivingLicensesAnswer,
  EducationAnswer,
  JobHistoryAnswer,
  JobWishesAnswer,
  LanguageAnswers,
  PaymentInformationAnswer,
} from '@island.is/application/templates/activation-allowance'
import { ExternalData, FormValue } from '@island.is/application/types'
import {
  GaldurDomainModelsApplicantsApplicantProfileDTOsDrivingLicense,
  GaldurDomainModelsApplicantsApplicantProfileDTOsEducation,
  GaldurDomainModelsApplicantsApplicantProfileDTOsJob,
  GaldurDomainModelsApplicantsApplicantProfileDTOsLanguage,
  GaldurDomainModelsApplicantsApplicantProfileDTOsPersonalInformation,
  GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsActivationGrantSupportData,
  GaldurDomainModelsSelectItem,
} from '@island.is/clients/vmst-unemployment'

export const parseDateSafe = (dateStr?: string): Date | undefined => {
  if (!dateStr) return undefined

  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? undefined : date
}

export const getApplicantInfo = (
  answers: FormValue,
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
      currentPostCodeId: other?.postalCode,
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
):
  | ContactAnswer // Add type when we have it
  | undefined => {
  const contact = getValueViaPath<ContactAnswer>(answers, 'contact')

  // Validate fields etc.

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
): { id: string; name: string }[] | undefined => {
  const jobWishes = getValueViaPath<JobWishesAnswer>(answers, 'jobWishes')
  const jobWishesPayload = (jobWishes?.jobs || []).map((job) => {
    return {
      id: job,
      name: 'Fetch job name here via id',
    }
  })
  return jobWishesPayload
}

export const getJobHistoryInfo = (
  answers: FormValue,
): GaldurDomainModelsApplicantsApplicantProfileDTOsJob[] | undefined => {
  const jobHistoryAnswers =
    getValueViaPath<JobHistoryAnswer[]>(answers, 'jobHistory', []) || []
  jobHistoryAnswers.map((job) => ({
    employer: job.companyName,
    started: parseDateSafe(job.startDate),
    quit: parseDateSafe(job.endDate),
    jobName: job.jobName,
  }))

  return jobHistoryAnswers
}

export const getBankInfo = (
  answers: FormValue,
): PaymentInformationAnswer | undefined => {
  const bankInfo = getValueViaPath<PaymentInformationAnswer>(
    answers,
    'paymentInformation',
  )
  return bankInfo
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
    //id: '', // What id is this ???
    educationId: item.levelOfStudy, // Nam
    educationSubCategoryId: item.degree, // Profgrada
    educationSubSubCategoryId: item.subject, // namsgrein
    yearFinished:
      item.endOfStudies !== undefined && !isNaN(parseInt(item.endOfStudies))
        ? parseInt(item.endOfStudies)
        : undefined,
  }))
}
