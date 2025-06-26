import { ExternalData } from '@island.is/application/types'

import { FormValue } from '@island.is/application/types'

import { getValueViaPath } from '@island.is/application/core'
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
  getWorkingAbilityString,
} from './stringMappers'

export const getApplicantOverviewItems = (
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

export const getEmploymentInformationOverviewItems = (
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

export const getEducationOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const lastTvelveMonths =
    getValueViaPath<string>(answers, 'education.lastTwelveMonths', '') ?? ''
  return [
    {
      width: 'full',
      keyText: overviewMessages.labels.education.education,
      valueText:
        getValueViaPath<string>(answers, 'education.lastTwelveMonths', '') ??
        '',
    },
  ]
}

export const getPayoutOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'half',
      keyText: overviewMessages.labels.payout.paymentInformation,
      valueText: getValueViaPath<string>(answers, 'applicant.name') ?? '',
    },
    {
      width: 'half',
      keyText: overviewMessages.labels.payout.personalDiscount,
      valueText:
        getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
    },
    {
      width: 'half',
      keyText: overviewMessages.labels.payout.vacation,
      valueText:
        getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
    },
    {
      width: 'half',
      keyText: overviewMessages.labels.payout.otherPayouts,
      valueText:
        getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
    },
  ]
}

export const getEmploymentSearchOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'half',
      keyText: overviewMessages.labels.employmentSearch.employmentWishes,
      valueText: getValueViaPath<string>(answers, 'applicant.name') ?? '',
    },
    {
      width: 'half',
      keyText: overviewMessages.labels.employmentSearch.otherRegions,
      valueText:
        getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
    },
  ]
}

export const getEducationHistoryOverviewItems = (
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

export const getLicenseOverviewItems = (
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

export const getLanguageOverviewItems = (
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

export const getEURESOverviewItems = (
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

export const getResumeOverviewItems = (
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
