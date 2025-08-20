import {
  AttachmentItem,
  ExternalData,
  FormTextArray,
} from '@island.is/application/types'
import { FormValue } from '@island.is/application/types'
import { format as formatKennitala } from 'kennitala'
import { getValueViaPath } from '@island.is/application/core'
import { KeyValueItem } from '@island.is/application/types'
import {
  academicBackground,
  applicant,
  application,
  cv,
  jobWishes as jobWishesMsgs,
  jobHistory as jobHistoryMsgs,
  languageSkills,
  paymentInformation,
  drivingLicenses,
} from '../lib/messages'
import { overview } from '../lib/messages/overview'
import { isSamePlaceOfResidenceChecked } from './isSamePlaceOfResidenceChecked'
import { contact } from '../lib/messages/contact'
import { isContactDifferentFromApplicant } from './isContactDifferentFromApplicant'
import {
  GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsActivationGrantSupportData,
  GaldurDomainModelsEducationProgramDTO,
  GaldurDomainModelsSelectItem,
  GaldurDomainModelsSettingsJobCodesJobCodeDTO,
} from '@island.is/clients/vmst-unemployment'
import { Locale } from '@island.is/shared/types'
import {
  CVAnswers,
  EducationAnswer,
  JobHistoryAnswer,
  LanguageAnswers,
} from '../lib/dataSchema'

export const getApplicantOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: applicant.general.pageTitle,
      valueText: [
        getValueViaPath<string>(answers, 'applicant.name') ?? '',
        formatKennitala(
          getValueViaPath<string>(answers, 'applicant.nationalId') ?? '',
        ),
        isSamePlaceOfResidenceChecked(answers)
          ? `${getValueViaPath<string>(
              answers,
              'applicant.other.address',
            )}, ${getValueViaPath<string>(
              answers,
              'applicant.other.postalCode',
            )}`
          : `${getValueViaPath<string>(
              answers,
              'applicant.address',
            )}, ${getValueViaPath<string>(
              answers,
              'applicant.postalCode',
            )} ${getValueViaPath<string>(answers, 'applicant.city')}`,
        {
          ...overview.labels.phoneNumber,
          values: {
            value:
              getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
          },
        },
        getValueViaPath<string>(answers, 'applicant.email') ?? '',
      ],
    },
  ]
}

export const getPaymentOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const bankNumber =
    getValueViaPath<string>(answers, 'paymentInformation.bankNumber') ?? ''
  const ledger =
    getValueViaPath<string>(answers, 'paymentInformation.ledger') ?? ''
  const accountNumber =
    getValueViaPath<string>(
      answers,
      'paymentInformation.accountNumber',
    )?.padStart(6, '0') ?? ''
  const value = `${bankNumber}-${ledger}-${accountNumber}`
  return [
    {
      width: 'full',
      keyText: paymentInformation.general.pageTitle,
      valueText: [
        {
          ...overview.labels.bank,
          values: {
            value: value,
          },
        },
      ],
    },
  ]
}

export const getContactOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const isDifferent = isContactDifferentFromApplicant(answers)
  let valueText: FormTextArray = []
  if (isDifferent) {
    valueText = [
      {
        ...overview.labels.name,
        values: {
          value: getValueViaPath<string>(answers, 'contact.name') ?? '',
        },
      },
      {
        ...overview.labels.contactConnection,
        values: {
          value: getValueViaPath<string>(answers, 'contact.connection') ?? '',
        },
      },
      {
        ...overview.labels.email,
        values: {
          value: getValueViaPath<string>(answers, 'contact.email') ?? '',
        },
      },
      {
        ...overview.labels.phoneNumber,
        values: {
          value: getValueViaPath<string>(answers, 'contact.phone') ?? '',
        },
      },
    ]
  } else {
    valueText = [
      {
        ...overview.labels.contactIsSameAsApplicant,
      },
    ]
  }

  return [
    {
      width: 'full',
      keyText: contact.general.pageTitle,
      valueText: valueText,
    },
  ]
}

export const getJobWishesOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
  _userNationalId: string,
  locale: Locale,
): Array<KeyValueItem> => {
  const jobWishes = getValueViaPath<Array<string>>(answers, 'jobWishes.jobs')
  const escoJobs = getValueViaPath<
    GaldurDomainModelsSettingsJobCodesJobCodeDTO[]
  >(
    externalData,
    'activityGrantApplication.data.activationGrant.supportData.jobCodes',
  )
  const jobWishSet = new Set(jobWishes)

  const matchedJobs = (escoJobs ?? []).filter((job) => {
    if (!job.id) return false
    return jobWishSet.has(job.id)
  })

  return [
    {
      width: 'full',
      keyText: jobWishesMsgs.general.pageTitle,
      valueText: matchedJobs.map((job) =>
        locale === 'is' ? job.name : job.english,
      ),
    },
  ]
}

export const getJobHistoryOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
  _userNationalId: string,
  _locale: Locale,
): Array<KeyValueItem> => {
  const jobHistory =
    getValueViaPath<JobHistoryAnswer[]>(answers, 'jobHistory') ?? []
  const escoJobs =
    getValueViaPath<GaldurDomainModelsSettingsJobCodesJobCodeDTO[]>(
      externalData,
      'activityGrantApplication.data.activationGrant.supportData.jobCodes',
    ) ?? []

  // Create a lookup map from esco job ID -> full job
  const escoJobMap = new Map(escoJobs.map((job) => [job.id, job]))

  // Combine job history and matched esco job names
  const combinedJobs = jobHistory
    .map((history) => {
      const escoJob = escoJobMap.get(history.jobName) // jobName is the ID
      if (!escoJob) return null

      return {
        companyName: history.companyName,
        jobNameFromEscojobs: escoJob.name,
        jobDate: `${history.startDate} - ${history.endDate}`,
      }
    })
    .filter(
      (
        job,
      ): job is {
        companyName: string
        jobNameFromEscojobs: string
        jobDate: string
      } => Boolean(job),
    )

  return [
    {
      width: 'full',
      keyText: jobHistoryMsgs.general.pageTitle,
      valueText: combinedJobs.map(
        (job) =>
          `${job.companyName}: ${job.jobNameFromEscojobs}, ${job.jobDate}`,
      ),
    },
  ]
}

export const getAcademicBackgroundOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
  _userNationalId: string,
  locale: Locale,
): Array<KeyValueItem> => {
  const educationAnswers =
    getValueViaPath<EducationAnswer>(answers, 'academicBackground')
      ?.education ?? []

  const educationPrograms =
    getValueViaPath<GaldurDomainModelsEducationProgramDTO[]>(
      externalData,
      'activityGrantApplication.data.activationGrant.supportData.educationPrograms',
    ) ?? []

  const getLocalized = (
    icelandic: string | undefined,
    english: string | undefined,
  ) => (locale === 'is' ? icelandic : english)

  // Helper to combine defined parts
  const joinDefined = (parts: Array<string | undefined | null>) =>
    parts.filter(Boolean).join(', ')

  const combinedEducations = educationAnswers.map((program) => {
    const programData = educationPrograms.find(
      (x) => x.id === program.levelOfStudy,
    )
    const degreeData = programData?.degrees?.find(
      (x) => x.id === program.degree,
    )
    const subjectData = degreeData?.subjects?.find(
      (x) => x.id === program.subject,
    )

    const level = getLocalized(
      programData?.name || '',
      programData?.english || '',
    )
    const degree = getLocalized(
      degreeData?.name || '',
      degreeData?.english || '',
    )
    const subject = getLocalized(
      subjectData?.name || '',
      subjectData?.name || '',
    )

    return joinDefined([level, degree, subject])
  })

  return [
    {
      width: 'full',
      keyText: academicBackground.general.pageTitle,
      valueText: combinedEducations,
    },
  ]
}

export const getDrivingLicensesOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
  _userNationalId: string,
  locale: Locale,
): Array<KeyValueItem> => {
  const supportData =
    getValueViaPath<GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsActivationGrantSupportData>(
      externalData,
      'activityGrantApplication.data.activationGrant.supportData',
    )
  const drivingLicenseAnswers = (
    getValueViaPath<Array<string>>(
      answers,
      'drivingLicense.drivingLicenseType',
    ) || []
  )
    .map((license) => {
      const licenseObj = supportData?.drivingLicenses?.find(
        (l) => l.id === license,
      )
      return locale === 'en' ? licenseObj?.english : licenseObj?.name
    })
    .filter(Boolean)
  const heavyMachineryLicenseAnswers = (
    getValueViaPath<Array<string>>(
      answers,
      'drivingLicense.heavyMachineryLicenses',
    ) || []
  )
    .map((license) => {
      const licenseObj = supportData?.heavyMachineryLicenses?.find(
        (l) => l.id === license,
      )
      return locale === 'en' ? licenseObj?.english : licenseObj?.name
    })
    .filter(Boolean)

  return [
    {
      width: 'full',
      keyText: drivingLicenses.general.pageTitle,
      valueText: [
        {
          ...overview.labels.drivingLicenses,
          values: {
            value: drivingLicenseAnswers.filter(Boolean).join(', '),
          },
        },
        {
          ...overview.labels.heavyMachineryLicenses,
          values: {
            value: heavyMachineryLicenseAnswers.filter(Boolean).join(', '),
          },
        },
      ],
    },
  ]
}

export const getLanguageSkillsOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
  _userNationalId: string,
  locale: Locale,
): Array<KeyValueItem> => {
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
  const getLocalized = (
    icelandic: string | undefined,
    english: string | undefined,
  ) => (locale === 'is' ? icelandic : english)

  const icelandicAbility = findSkillValue(
    languageSkillAnswers?.icelandicAbility || '',
  )
  const englishAbility = findSkillValue(
    languageSkillAnswers?.englishAbility || '',
  )

  const otherLanguagesToDisplay =
    languageSkillAnswers?.other.map((skills) => {
      const languageSkill = findSkillValue(skills.skills || '')
      const languageNames = findLanguageValue(skills.language || '')
      return `${getLocalized(
        languageNames?.name || '',
        languageNames?.english || '',
      )}: ${getLocalized(
        languageSkill?.name || '',
        languageSkill?.english || '',
      )}`
    }) || []

  return [
    {
      width: 'full',
      keyText: languageSkills.general.pageTitle,
      valueText: [
        `${languageSkillAnswers?.icelandic}: ${getLocalized(
          icelandicAbility?.name || '',
          icelandicAbility?.english || '',
        )}`,
        `${languageSkillAnswers?.english}: ${getLocalized(
          englishAbility?.name || '',
          englishAbility?.english || '',
        )}`,
        otherLanguagesToDisplay.flat(),
      ],
    },
  ]
}

export const getCVData = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<AttachmentItem> => {
  const cv = getValueViaPath<CVAnswers>(answers, 'cv')
  return [
    {
      width: 'full',
      fileName: cv?.cvFile?.file[0].name || '',
      fileType: cv?.cvFile?.file[0].name.split('.')[1],
    },
  ]
}

export const getCVText = (
  _answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: cv.general.pageTitle,
      valueText: [
        {
          ...application.yesLabel,
        },
      ],
    },
  ]
}
