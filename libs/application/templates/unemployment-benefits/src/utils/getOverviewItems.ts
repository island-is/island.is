import { ExternalData, FormText } from '@island.is/application/types'

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
import { overview, overview as overviewMessages } from '../lib/messages'
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
import { StaticText } from '@island.is/shared/types'
import { GaldurDomainModelsSelectItem } from '@island.is/clients/vmst-unemployment'
import { formatDate } from './formatDate'
import {
  wasStudyingInTheLastYear,
  wasStudyingLastSemester,
} from './educationInformation'

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
  const { formatMessage, locale } = useLocale()
  const lastTvelveMonths = getValueViaPath<YesOrNo>(
    answers,
    'education.lastTwelveMonths',
    NO,
  )
  const lastTvelveMonthsString: StaticText =
    getValueViaPath<YesOrNo>(answers, 'education.lastTwelveMonths', NO) === 'no'
      ? overviewMessages.labels.education.notLastTvelveMonths
      : ''

  const educationAnswer =
    getValueViaPath<EducationType>(answers, 'education.typeOfEducation') ?? ''

  const educationString = educationAnswer
    ? getLastTvelveMonthsEducationString(educationAnswer)
    : ''

  const valueItems = [lastTvelveMonthsString]
  if (lastTvelveMonths === YES) {
    educationString && valueItems.push(educationString)
  }

  const currentEducation = getValueViaPath<CurrentEducationInAnswers>(
    answers,
    'educationHistory.currentStudies',
  )

  const overviewItems: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: overviewMessages.labels.education.education,
      valueText: valueItems,
    },
  ]

  if (currentEducation) {
    const educationValueItems = [
      currentEducation.levelOfStudy,
      currentEducation.degree,
      currentEducation.courseOfStudy,
    ]
    const showEndDateLabel =
      wasStudyingInTheLastYear(answers) || wasStudyingLastSemester(answers)
    if (currentEducation.endDate) {
      educationValueItems.push(
        `${
          showEndDateLabel
            ? formatMessage(overviewMessages.labels.education.endDate)
            : formatMessage(overviewMessages.labels.education.predictedEndDate)
        }: ${formatDate(currentEducation.endDate)}`,
      )
    }

    overviewItems.push({
      width: 'full',
      keyText: overviewMessages.labels.education.currentEducation,
      valueText: [
        currentEducation.levelOfStudy,
        currentEducation.degree,
        currentEducation.courseOfStudy,
        `${formatMessage(
          overviewMessages.labels.education.endDate,
        )}: ${formatDate(
          currentEducation.endDate ? currentEducation.endDate : '',
        )}`,
      ],
    })
  }

  return overviewItems
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

  const interestedInOutsideYourLocation =
    getValueViaPath<YesOrNo>(answers, 'jobWishes.outsideYourLocation', NO) ?? NO
  const outsideYourLocationStrings = outsideYourLocation.map((location) => {
    return getLocationString(location, _externalData, locale)
  })

  const overviewItems: Array<KeyValueItem> = [
    {
      width: 'half',
      keyText: overviewMessages.labels.employmentSearch.employmentWishes,
      valueText: requestedEmploymentString,
    },
  ]
  if (interestedInOutsideYourLocation === YES) {
    overviewItems.push({
      width: 'half',
      keyText: overviewMessages.labels.employmentSearch.otherRegions,
      valueText: outsideYourLocationStrings,
    })
  }
  return overviewItems
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

  const overviewItems: Array<KeyValueItem> = []
  if (currentEducation) {
    overviewItems.push({
      width: 'half',
      keyText: `${formatMessage(
        overviewMessages.labels.educationHistory.educationHistory,
      )} ${1}`,
      valueText: [
        currentEducation?.levelOfStudy,
        currentEducation?.degree,
        currentEducation?.courseOfStudy,
      ],
    })
  }
  if (mappedHistory.length > 0) {
    overviewItems.push(...mappedHistory)
  }
  return overviewItems
}

export const useLicenseOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const hasDriversLicense = getValueViaPath<Array<YesOrNoEnum>>(
    answers,
    'licenses.hasDrivingLicense',
  )
  const hasHeavyMachineryLicense = getValueViaPath<Array<YesOrNoEnum>>(
    answers,
    'licenses.hasHeavyMachineryLicense',
  )

  const overviewItems: Array<KeyValueItem> = []
  if (hasDriversLicense && hasDriversLicense[0] === YES) {
    overviewItems.push({
      width: 'half',
      keyText: overviewMessages.labels.license.drivingLicense,
      valueText: getValueViaPath<string>(
        answers,
        'licenses.drivingLicenseTypes',
      ),
    })
  }
  if (hasHeavyMachineryLicense && hasHeavyMachineryLicense[0] === YES) {
    overviewItems.push({
      width: 'half',
      keyText: overviewMessages.labels.license.workMachineLicense,
      valueText: getValueViaPath<string[]>(
        answers,
        'licenses.heavyMachineryLicensesTypes',
      ),
    })
  }
  return overviewItems
}

export const useLanguageOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const allLanguages =
    getValueViaPath<Array<LanguagesInAnswers>>(answers, 'languageSkills', []) ??
    []
  const allLanguageStrings = allLanguages.map(
    (language: LanguagesInAnswers, index: number) => {
      if (index < 2) {
        //first two are default languages with no id's
        return `${language.language}: ${language.skill}`
      }
      const languages =
        getValueViaPath<Array<GaldurDomainModelsSelectItem>>(
          _externalData,
          'unemploymentApplication.data.supportData.languageKnowledge',
        ) || []
      const languageSkills =
        getValueViaPath<Array<GaldurDomainModelsSelectItem>>(
          _externalData,
          'unemploymentApplication.data.supportData.languageValues',
        ) || []
      const languageName = languages.find(
        (x) => x.name === language.language,
      )?.name
      const languageSkill = languageSkills.find(
        (x) => x.id === language.skill,
      )?.name

      return `${languageName}: ${languageSkill}`
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
