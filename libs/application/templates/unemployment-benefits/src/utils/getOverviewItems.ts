import { ExternalData } from '@island.is/application/types'

import { FormValue } from '@island.is/application/types'

import { getValueViaPath, NO, YesOrNo } from '@island.is/application/core'
import { KeyValueItem } from '@island.is/application/types'
import { overview as overviewMessages } from '../lib/messages'
import {
  ChildrenInAnswers,
  EmploymentStatus,
  PreviousJobInAnswers,
  WorkingAbility,
} from '../shared'
import * as kennitala from 'kennitala'
import {
  getCurrentSituationString,
  getJobString,
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
  const childrenInCustody =
    getValueViaPath<Array<ChildrenInAnswers>>(
      answers,
      'familyInformation.children',
      [],
    ) || []
  const addedChildren =
    getValueViaPath<Array<ChildrenInAnswers>>(
      answers,
      'familyInformation.additionalChildren',
      [],
    ) || []

  const combinedChildren = [...childrenInCustody, ...addedChildren]
  const childrenValueText = combinedChildren.map((x) => x.name)
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
  const lastJob =
    getValueViaPath<string>(
      answers,
      'employmentHistory.lastJob.companyName',
      '',
    ) || ''
  const addedJobs =
    getValueViaPath<Array<PreviousJobInAnswers>>(
      answers,
      'employmentHistory.previousJobs',
      [],
    ) || []

  const combinedEmploymentHistory = [
    lastJob,
    ...addedJobs.map((job) => job.company.name),
  ]
  return [
    {
      width: 'half',
      keyText: overviewMessages.labels.employmentInformation.information,
      valueText: [reason, currentSituationString, abilityString],
    },
    {
      width: 'half',
      keyText: overviewMessages.labels.employmentInformation.history,
      valueText: combinedEmploymentHistory,
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
    getValueViaPath<WorkingAbility>(answers, 'education.typeOfEducation') ?? ''

  const educationString = educationAnswer
    ? getWorkingAbilityString(educationAnswer)
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
  const educationHistory = getValueViaPath(answers, 'educationHistory', [])
  return [
    {
      width: 'half',
      keyText: overviewMessages.labels.employmentSearch.otherRegions,
      valueText: getValueViaPath<string>(answers, 'applicant.name') ?? '',
    },
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
      valueText: getValueViaPath<string>(answers, 'applicant.name') ?? '',
    },
    {
      width: 'half',
      keyText: overviewMessages.labels.license.workMachineLicense,
      valueText:
        getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
    },
  ]
}

export const useLanguageOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: overviewMessages.labels.languages.languages,
      valueText: getValueViaPath<string>(answers, 'applicant.name') ?? '',
    },
  ]
}

export const useEURESOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: overviewMessages.labels.eures.eures,
      valueText: getValueViaPath<string>(answers, 'applicant.name') ?? '',
    },
  ]
}

export const useResumeOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: overviewMessages.labels.resume.resume,
      valueText: getValueViaPath<string>(answers, 'applicant.name') ?? '',
    },
  ]
}
