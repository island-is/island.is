import { ExternalData } from '@island.is/application/types'

import { FormValue } from '@island.is/application/types'

import {
  coreMessages,
  getValueViaPath,
  NO,
  YES,
  YesOrNo,
  YesOrNoEnum,
} from '@island.is/application/core'
import { KeyValueItem } from '@island.is/application/types'
import { overview as overviewMessages } from '../lib/messages'
import {
  FamilyInformationInAnswers,
  EducationHistoryInAnswers,
  EmploymentStatus,
  FileInAnswers,
  LanguagesInAnswers,
  WorkingAbility,
  LastJobsInAnswers,
  EducationType,
  CurrentEducationInAnswers,
  PreviousEducationInAnswers,
} from '../shared'
import * as kennitala from 'kennitala'
import {
  getCurrentSituationString,
  getEducationStrings,
  getJobString,
  getLastTvelveMonthsEducationString,
  getLocationString,
  getWorkingAbilityString,
} from './stringMappers'
import {
  useOtherPaymentsAnswers,
  usePayoutAnswers,
  useVacationAnswers,
} from './overviewAnswers'
import { useLocale } from '@island.is/localization'

export const useApplicantOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const children = getValueViaPath<FamilyInformationInAnswers>(
    answers,
    'familyInformation',
    undefined,
  )
  const childrenInCustody = children?.children ?? []
  const addedChildren = children?.additionalChildren?.map((x) => x.child) ?? []

  const combinedChildren = [...childrenInCustody, ...addedChildren]
  const childrenValueText = combinedChildren.map((x) => x?.name)
  return [
    {
      width: 'half',
      keyText: overviewMessages.labels.applicantOverview.applicant,
      valueText: [
        getValueViaPath<string>(answers, 'applicant.name') ?? '',
        kennitala.format(
          getValueViaPath<string>(answers, 'applicant.nationalId') ?? '',
        ),
        `${getValueViaPath<string>(answers, 'applicant.address') ?? ''}, ${
          getValueViaPath<string>(answers, 'applicant.postalCode') ?? ''
        } ${getValueViaPath<string>(answers, 'applicant.city') ?? ''}`,
        getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
        getValueViaPath<string>(answers, 'applicant.email') ?? '',
      ],
    },
    {
      width: 'half',
      keyText: overviewMessages.labels.applicantOverview.children,
      valueText: childrenValueText,
    },
  ]
}

export const useEmploymentInformationOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const reason =
    getValueViaPath<string>(answers, 'reasonForJobSearch.mainReason') ?? ''
  const currentSituationAnswer =
    getValueViaPath<EmploymentStatus>(answers, 'currentSituation.status') ??
    undefined

  const currentSituationString = currentSituationAnswer
    ? getCurrentSituationString(currentSituationAnswer)
    : ''

  const abilityAnswer =
    getValueViaPath<WorkingAbility>(answers, 'workingAbility.status') ?? ''

  const abilityString = abilityAnswer
    ? getWorkingAbilityString(abilityAnswer)
    : ''
  const employmentHistory =
    getValueViaPath<LastJobsInAnswers>(
      answers,
      'employmentHistory.lastJobs',
      [],
    ) ?? []

  const historyNames = employmentHistory.map((job) => {
    return `${job.employer?.name}: ${job.title}`
  })

  return [
    {
      width: 'half',
      keyText: overviewMessages.labels.employmentInformation.information,
      valueText: [reason, currentSituationString, abilityString],
    },
    {
      width: 'half',
      keyText: overviewMessages.labels.employmentInformation.history,
      valueText: historyNames,
    },
  ]
}

export const useEducationOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const lastTvelveMonths =
    getValueViaPath<YesOrNo>(answers, 'education.lastTwelveMonths', NO) === 'no'
      ? overviewMessages.labels.education.notLastTvelveMonths
      : ''

  const educationAnswer =
    getValueViaPath<EducationType>(answers, 'education.typeOfEducation') ?? ''

  const educationString = educationAnswer
    ? getLastTvelveMonthsEducationString(educationAnswer)
    : ''
  return [
    {
      width: 'full',
      keyText: overviewMessages.labels.education.education,
      valueText: [lastTvelveMonths, educationString],
    },
  ]
}

export const usePayoutOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const { formatMessage, locale } = useLocale()
  const payoutAnswers = usePayoutAnswers(answers, _externalData)
  const vacationAnswers = useVacationAnswers(answers)
  const otherPaymentsAnswers = useOtherPaymentsAnswers(
    answers,
    _externalData,
    locale,
  )
  return [
    {
      width: 'half',
      keyText: overviewMessages.labels.payout.paymentInformation,
      valueText: payoutAnswers,
    },
    {
      width: 'half',
      keyText: overviewMessages.labels.payout.taxDiscount,
      valueText: `${formatMessage(overviewMessages.labels.payout.taxUsage)}: ${
        getValueViaPath<string>(answers, 'taxDiscount.taxDiscount') ?? ''
      }%`,
    },
    {
      width: 'half',
      keyText: overviewMessages.labels.payout.vacation,
      valueText: vacationAnswers,
    },
    {
      width: 'half',
      keyText: overviewMessages.labels.payout.otherPayouts,
      valueText: otherPaymentsAnswers,
    },
  ]
}

export const useEmploymentSearchOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const { locale } = useLocale()
  const requestedEmployment =
    getValueViaPath<Array<string>>(answers, 'jobWishes.jobList', []) ?? []

  const requestedEmploymentString = requestedEmployment.map((job) => {
    return getJobString(job, _externalData, locale)
  })

  const outsideYourLocation =
    getValueViaPath<Array<string>>(answers, 'jobWishes.location', []) ?? []

  const outsideYourLocationStrings = outsideYourLocation.map((location) => {
    return getLocationString(location, _externalData, locale)
  })

  return [
    {
      width: 'half',
      keyText: overviewMessages.labels.employmentSearch.employmentWishes,
      valueText: requestedEmploymentString,
    },
    {
      width: 'half',
      keyText: overviewMessages.labels.employmentSearch.otherRegions,
      valueText: outsideYourLocationStrings,
    },
  ]
}

export const useEducationHistoryOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const { formatMessage, locale } = useLocale()
  const currentEducation = getValueViaPath<CurrentEducationInAnswers>(
    answers,
    'educationHistory.currentStudies',
  )
  const educationHistory =
    getValueViaPath<Array<PreviousEducationInAnswers>>(
      answers,
      'educationHistory.educationHistory',
      [],
    ) ?? []
  const mappedHistory: Array<KeyValueItem> = educationHistory.map(
    (item, index) => {
      const educationStrings = getEducationStrings(item, _externalData, locale)
      return {
        width: 'half',
        keyText: `${formatMessage(
          overviewMessages.labels.educationHistory.educationHistory,
        )} ${index + 2}`,
        valueText: [
          educationStrings.levelOfStudy,
          educationStrings.degree,
          educationStrings.courseOfStudy,
        ],
      }
    },
  )

  return [
    {
      width: 'half',
      keyText: `${formatMessage(
        overviewMessages.labels.educationHistory.educationHistory,
      )} ${1}`,
      valueText: [
        currentEducation?.levelOfStudy,
        currentEducation?.degree,
        currentEducation?.courseOfStudy,
      ],
    },
    ...mappedHistory,
  ]
}

export const useLicenseOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'half',
      keyText: overviewMessages.labels.license.drivingLicense,
      valueText:
        getValueViaPath<string>(answers, 'drivingLicense.drivingLicenseType') ??
        '',
    },
    {
      width: 'half',
      keyText: overviewMessages.labels.license.workMachineLicense,
      valueText:
        getValueViaPath<string>(
          answers,
          'drivingLicense.heavyMachineryLicenses',
        ) ?? '',
    },
  ]
}

export const useLanguageOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const allLanguages =
    getValueViaPath<Array<LanguagesInAnswers>>(answers, 'languageSkills', []) ??
    []
  const allLanguageStrings = allLanguages.map(
    (language: LanguagesInAnswers) => {
      return `${language.language}: ${language.skill}`
    },
  )
  return [
    {
      width: 'full',
      keyText: overviewMessages.labels.languages.languages,
      valueText: allLanguageStrings,
    },
  ]
}

export const useEURESOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const aggreement =
    getValueViaPath<string>(answers, 'euresJobSearch.agreement') ?? ''
  return [
    {
      width: 'full',
      keyText: overviewMessages.labels.eures.eures,
      valueText:
        aggreement === YES ? coreMessages.radioYes : coreMessages.radioNo,
    },
  ]
}

export const useResumeOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const fileName =
    getValueViaPath<Array<FileInAnswers>>(
      answers,
      'resume.resumeFile.file',
      [],
    ) ?? []
  return [
    {
      width: 'full',
      keyText: overviewMessages.labels.resume.resume,
      valueText: [
        getValueViaPath<YesOrNoEnum>(
          answers,
          'resume.doesOwnResume',
          YesOrNoEnum.NO,
        ) === YES
          ? coreMessages.radioYes
          : coreMessages.radioNo,
        fileName[0]?.name,
      ],
    },
  ]
}
