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
import {
  overview as overviewMessages,
  education as educationMessages,
} from '../lib/messages'
import {
  FamilyInformationInAnswers,
  EmploymentStatus,
  FileSchemaInAnswers,
  LanguagesInAnswers,
  EducationType,
  PreviousEducationInAnswers,
  EmploymentHistoryInAnswers,
  RepeatableRequiredEducationInAnswers,
} from '../shared'
import * as kennitala from 'kennitala'
import {
  getCurrentSituationString,
  getEducationStrings,
  getJobString,
  getLastTvelveMonthsEducationString,
  getLocationString,
  getReasonForJobSearchString,
  getWorkingAbilityString,
} from './stringMappers'
import {
  useOtherPaymentsAnswers,
  usePayoutAnswers,
  useVacationAnswers,
} from './overviewAnswers'
import { useLocale } from '@island.is/localization'
import { StaticText } from '@island.is/shared/types'

import {
  GaldurDomainModelsSelectItem,
  GaldurDomainModelsSettingsDrivingLicensesDrivingLicensesDTO,
  GaldurDomainModelsSettingsHeavyMachineryLicensesHeavyMachineryLicensesDTO,
  GaldurDomainModelsSettingsPostcodesPostcodeDTO,
} from '@island.is/clients/vmst-unemployment'
import {
  wasStudyingInTheLastYear,
  wasStudyingLastSemester,
} from './educationInformation'
import { getEmploymentFromRsk } from './getEmploymenInfo'

export const useApplicantOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const { formatMessage } = useLocale()
  const children = getValueViaPath<FamilyInformationInAnswers>(
    answers,
    'familyInformation',
    undefined,
  )
  const childrenInCustody = children?.children ?? []
  const addedChildren = children?.additionalChildren?.map((x) => x.child) ?? []

  const combinedChildren = [...childrenInCustody, ...addedChildren]
  const childrenValueText = combinedChildren.map((x) => x?.name)

  const differentResidence = getValueViaPath<YesOrNoEnum>(
    answers,
    'applicant.otherAddressCheckbox',
  )

  const overviewItems: Array<KeyValueItem> = [
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
        `${formatMessage(
          overviewMessages.labels.applicantOverview.password,
        )}: ${getValueViaPath<string>(answers, 'applicant.password') ?? ''}`,
      ],
    },
    {
      width: 'half',
      keyText: overviewMessages.labels.applicantOverview.children,
      valueText: childrenValueText,
    },
  ]

  if (differentResidence?.includes(YES)) {
    const nameAndPostcode = getValueViaPath<
      GaldurDomainModelsSettingsPostcodesPostcodeDTO[]
    >(externalData, 'unemploymentApplication.data.supportData.postCodes')
    const otherPostCodeId =
      getValueViaPath<string>(answers, 'applicant.otherPostcode') ?? ''
    const otherPostCodeName = nameAndPostcode?.find(
      (x) => x.id === otherPostCodeId,
    )?.nameAndCode
    overviewItems.push({
      width: 'half',
      keyText: overviewMessages.labels.applicantOverview.differentResidence,
      valueText: [
        getValueViaPath<string>(answers, 'applicant.otherAddress') ?? '',
        otherPostCodeName,
      ],
    })
  }

  return overviewItems
}

export const useEmploymentInformationOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const { locale } = useLocale()
  const mainReason =
    getValueViaPath<string>(answers, 'reasonForJobSearch.mainReason') ?? ''
  const additionalReason =
    getValueViaPath<string>(answers, 'reasonForJobSearch.additionalReason') ??
    ''
  const reasons = getReasonForJobSearchString(
    mainReason,
    _externalData,
    locale,
    additionalReason,
  )
  const currentSituationAnswer =
    getValueViaPath<EmploymentStatus>(answers, 'currentSituation.status') ??
    undefined

  const currentSituationString = currentSituationAnswer
    ? getCurrentSituationString(currentSituationAnswer)
    : ''

  const abilityAnswer =
    getValueViaPath<string>(answers, 'workingAbility.status') ?? ''

  const abilityString = abilityAnswer
    ? getWorkingAbilityString(abilityAnswer, _externalData, locale)
    : ''
  const employmentHistory = getValueViaPath<EmploymentHistoryInAnswers>(
    answers,
    'employmentHistory',
  )

  const rskEmploymentList = getEmploymentFromRsk(_externalData)

  const previousJobInformation = employmentHistory?.lastJobs?.map((job) => {
    const employerName =
      job.nationalIdWithName && job.nationalIdWithName !== '-'
        ? rskEmploymentList.find(
            (x) => x.employerSSN === job.nationalIdWithName,
          )?.employer
        : job.employer?.name
    return `${employerName}: ${job.title}`
  })

  const currentJobInformation = employmentHistory?.currentJobs?.map((job) => {
    const employerName =
      job.nationalIdWithName && job.nationalIdWithName !== '-'
        ? rskEmploymentList.find(
            (x) => x.employerSSN === job.nationalIdWithName,
          )?.employer
        : job.employer?.name
    return `${employerName}: ${job.title}`
  })

  return [
    {
      width: 'half',
      keyText: overviewMessages.labels.employmentInformation.information,
      valueText: [
        reasons.additionalReason,
        currentSituationString,
        abilityString,
      ],
    },
    {
      width: 'half',
      keyText: overviewMessages.labels.employmentInformation.history,
      valueText: [previousJobInformation, currentJobInformation].flat(),
    },
  ]
}

export const useEducationOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const lastTvelveMonths = getValueViaPath<YesOrNo>(
    answers,
    'education.lastTwelveMonths',
    NO,
  )
  const lastTvelveMonthsString: StaticText =
    getValueViaPath<YesOrNo>(answers, 'education.lastTwelveMonths', NO) === NO
      ? overviewMessages.labels.education.notLastTvelveMonths
      : ''

  const educationAnswer =
    getValueViaPath<Array<EducationType>>(
      answers,
      'education.typeOfEducation',
    ) ?? []

  const educationStrings: Array<StaticText> = []
  educationAnswer?.forEach((answer) => {
    const edAnswer = getLastTvelveMonthsEducationString(answer)
    educationStrings.push(edAnswer)
  })

  const valueItems =
    lastTvelveMonthsString !== '' ? [lastTvelveMonthsString] : []
  if (lastTvelveMonths === YES) {
    valueItems.push(...educationStrings)
  }

  const overviewItems: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: overviewMessages.labels.education.education,
      valueText: valueItems,
    },
  ]

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
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const { formatMessage, locale } = useLocale()
  const overviewItems: Array<KeyValueItem> = []
  const typeOfEducationAnswers =
    getValueViaPath<Array<EducationType>>(
      answers,
      'education.typeOfEducation',
    ) ?? []

  const currentEducation =
    getValueViaPath<RepeatableRequiredEducationInAnswers>(
      answers,
      'educationHistory.currentStudies',
    )

  const lastSemesterEducation =
    getValueViaPath<RepeatableRequiredEducationInAnswers>(
      answers,
      'educationHistory.lastSemester',
    )

  const graduationLastTwelveMonthsEducation =
    getValueViaPath<RepeatableRequiredEducationInAnswers>(
      answers,
      'educationHistory.finishedEducation',
    )
  if (
    currentEducation &&
    typeOfEducationAnswers.includes(EducationType.CURRENT)
  ) {
    const educationStrings = getEducationStrings(
      currentEducation,
      externalData,
      locale,
    )
    const educationValueItems = [
      educationStrings.levelOfStudy,
      educationStrings.degree,
      educationStrings.courseOfStudy,
      `${formatMessage(
        educationMessages.labels.schoolProgramUnitsLabelPerSemester,
      )}: ${currentEducation.units}`,
    ]
    overviewItems.push({
      width: 'full',
      keyText: overviewMessages.labels.educationHistory.currentEducation,
      valueText: educationValueItems,
    })
  }

  if (
    lastSemesterEducation &&
    typeOfEducationAnswers.includes(EducationType.LAST_SEMESTER)
  ) {
    let thisEducationItem = lastSemesterEducation
    if (
      lastSemesterEducation.sameAsAboveEducation?.includes(YES) &&
      currentEducation
    ) {
      thisEducationItem = currentEducation
    }
    const educationStrings = getEducationStrings(
      thisEducationItem,
      externalData,
      locale,
    )
    const educationValueItems = [
      educationStrings.levelOfStudy,
      educationStrings.degree,
      educationStrings.courseOfStudy,
      `${formatMessage(
        educationMessages.labels.schoolProgramUnitsLabelPerSemester,
      )}: ${lastSemesterEducation.units}`, //units are per semester and are not shared even though the user checks the "same education" checkbox
    ]
    const showEndDateLabel =
      wasStudyingInTheLastYear(answers) || wasStudyingLastSemester(answers)
    if (thisEducationItem.endDate) {
      educationValueItems.push(
        `${
          showEndDateLabel
            ? formatMessage(overviewMessages.labels.educationHistory.endDate)
            : formatMessage(
                overviewMessages.labels.educationHistory.predictedEndDate,
              )
        }: ${thisEducationItem.endDate}`,
      )
    }

    overviewItems.push({
      width: 'full',
      keyText: overviewMessages.labels.educationHistory.lastSemesterEducation,
      valueText: educationValueItems,
    })
  }

  if (
    graduationLastTwelveMonthsEducation &&
    typeOfEducationAnswers.includes(EducationType.LAST_YEAR)
  ) {
    let thisEducationItem = graduationLastTwelveMonthsEducation
    if (
      graduationLastTwelveMonthsEducation.sameAsAboveEducation?.includes(YES) &&
      lastSemesterEducation
    ) {
      thisEducationItem = lastSemesterEducation
    }
    const educationStrings = getEducationStrings(
      thisEducationItem,
      externalData,
      locale,
    )

    const educationValueItems = [
      educationStrings.levelOfStudy,
      educationStrings.degree,
      educationStrings.courseOfStudy,
      `${formatMessage(educationMessages.labels.schoolProgramUnitsLabel)}: ${
        graduationLastTwelveMonthsEducation.units
      }`,
    ]
    const showEndDateLabel =
      wasStudyingInTheLastYear(answers) || wasStudyingLastSemester(answers)
    if (graduationLastTwelveMonthsEducation.endDate) {
      educationValueItems.push(
        `${
          showEndDateLabel
            ? formatMessage(overviewMessages.labels.educationHistory.endDate)
            : formatMessage(
                overviewMessages.labels.educationHistory.predictedEndDate,
              )
        }: ${graduationLastTwelveMonthsEducation.endDate}`,
      )
    }

    overviewItems.push({
      width: 'full',
      keyText:
        overviewMessages.labels.educationHistory
          .graduatedLastTvelweMonthsEducation,
      valueText: educationValueItems,
    })
  }

  const educationHistory =
    getValueViaPath<Array<PreviousEducationInAnswers>>(
      answers,
      'educationHistory.educationHistory',
      [],
    ) ?? []
  const mappedHistory: Array<KeyValueItem> = educationHistory.map(
    (item, index) => {
      const educationStrings = getEducationStrings(item, externalData, locale)
      return {
        width: 'half',
        keyText: `${formatMessage(
          overviewMessages.labels.educationHistory.educationHistory,
        )} ${index + 1}`,
        valueText: [
          educationStrings.levelOfStudy,
          educationStrings.degree,
          educationStrings.courseOfStudy,
        ],
      }
    },
  )

  if (mappedHistory.length > 0) {
    overviewItems.push(...mappedHistory)
  }
  return overviewItems
}

export const useLicenseOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const drivingLicenseTypes =
    getValueViaPath<
      Array<GaldurDomainModelsSettingsDrivingLicensesDrivingLicensesDTO>
    >(
      externalData,
      'unemploymentApplication.data.supportData.drivingLicenses',
    ) || []

  const heavyMachineryLicenses =
    getValueViaPath<
      Array<GaldurDomainModelsSettingsHeavyMachineryLicensesHeavyMachineryLicensesDTO>
    >(
      externalData,
      'unemploymentApplication.data.supportData.heavyMachineryLicenses',
    ) || []
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
    const ids = getValueViaPath<Array<string>>(
      answers,
      'licenses.drivingLicenseTypes',
    )
    const name = ids
      ?.map((id) => drivingLicenseTypes.find((x) => x.id === id)?.name)
      .filter(Boolean)

    overviewItems.push({
      width: 'half',
      keyText: overviewMessages.labels.license.drivingLicense,
      valueText: name,
    })
  }
  if (hasHeavyMachineryLicense && hasHeavyMachineryLicense[0] === YES) {
    const ids = getValueViaPath<Array<string>>(
      answers,
      'licenses.heavyMachineryLicensesTypes',
    )
    const name = ids
      ?.map((id) => heavyMachineryLicenses.find((x) => x.id === id)?.name)
      .filter(Boolean)
    overviewItems.push({
      width: 'half',
      keyText: overviewMessages.labels.license.workMachineLicense,
      valueText: name,
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
        const languageName =
          index === 0 ? 'Íslenska' : index === 1 ? 'Enska' : language.language
        return `${languageName}: ${language.skill}`
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
        (x) => x.id === language.language,
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
  const hasResume = getValueViaPath<YesOrNoEnum>(
    answers,
    'resume.doesOwnResume',
    YesOrNoEnum.NO,
  )

  const fileName =
    getValueViaPath<Array<FileSchemaInAnswers>>(
      answers,
      'resume.resumeFile',
      [],
    ) ?? []

  return [
    {
      width: 'full',
      keyText: overviewMessages.labels.resume.resume,
      valueText: [
        hasResume === YES ? coreMessages.radioYes : coreMessages.radioNo,
        fileName && fileName[0] ? fileName[0]?.name : '',
      ],
    },
  ]
}
