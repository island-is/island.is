import { formatText, getValueViaPath } from '@island.is/application/core'
import {
  MONTHS,
  ConnectedApplications,
  HomeAllowanceHousing,
  oldAgePensionAge,
  YES,
  fishermenMinAge,
  earlyRetirementMinAge,
  earlyRetirementMaxAge,
  NO,
  ApplicationType,
  Employment,
} from './constants'
import {
  ApplicantChildCustodyInformation,
  Option,
  Application,
  NationalRegistryResidenceHistory,
  YesOrNo,
} from '@island.is/application/types'
import { oldAgePensionFormMessage } from './messages'

import * as kennitala from 'kennitala'
import addYears from 'date-fns/addYears'
import addMonths from 'date-fns/addMonths'
import addDays from 'date-fns/addDays'
import { combinedResidenceHistory } from '../types'
import React from 'react'
import { useLocale } from '@island.is/localization'
import { getCountryByCode } from '@island.is/shared/utils'

interface fileType {
  key: string
  name: string
}

interface earlyRetirementPensionfundFishermen {
  earlyRetirement?: fileType[]
  pension?: fileType[]
  fishermen?: fileType[]
}

interface leaseAgreementSchoolConfirmation {
  leaseAgreement?: fileType[]
  schoolConfirmation?: fileType[]
}

interface selfEmployed {
  selfEmployedAttachment?: fileType[]
}

export function getApplicationAnswers(answers: Application['answers']) {
  const pensionFundQuestion = getValueViaPath(
    answers,
    'questions.pensionFund',
  ) as YesOrNo

  const applicationType = getValueViaPath(
    answers,
    'applicationType.option',
  ) as ApplicationType

  const selectedYear = getValueViaPath(answers, 'period.year') as string

  const selectedMonth = getValueViaPath(answers, 'period.month') as string

  const applicantEmail = getValueViaPath(
    answers,
    'applicantInfo.email',
  ) as string

  const applicantPhonenumber = getValueViaPath(
    answers,
    'applicantInfo.phonenumber',
  ) as string

  const residenceHistoryQuestion = getValueViaPath(
    answers,
    'residenceHistory.question',
  ) as YesOrNo

  const onePaymentPerYear = getValueViaPath(
    answers,
    'onePaymentPerYear.question',
  ) as YesOrNo

  const comment = getValueViaPath(answers, 'comment') as string

  const connectedApplications = getValueViaPath(
    answers,
    'connectedApplications',
  ) as ConnectedApplications[]

  const homeAllowanceHousing = getValueViaPath(
    answers,
    'homeAllowance.housing',
  ) as HomeAllowanceHousing

  const employment = getValueViaPath(
    answers,
    'employer.employment',
  ) as Employment

  const homeAllowanceChildren = getValueViaPath(
    answers,
    'homeAllowance.children',
  ) as YesOrNo

  return {
    pensionFundQuestion,
    applicationType,
    selectedYear,
    selectedMonth,
    applicantEmail,
    applicantPhonenumber,
    residenceHistoryQuestion,
    onePaymentPerYear,
    comment,
    connectedApplications,
    homeAllowanceHousing,
    homeAllowanceChildren,
    employment,
  }
}

export function getApplicationExternalData(
  externalData: Application['externalData'],
) {
  const residenceHistory = getValueViaPath(
    externalData,
    'nationalRegistryResidenceHistory.data',
    [],
  ) as NationalRegistryResidenceHistory[]

  const custodyInformation = getValueViaPath(
    externalData,
    'childrenCustodyInformation.data',
    [],
  ) as ApplicantChildCustodyInformation[]

  const cohabitants = getValueViaPath(
    externalData,
    'nationalRegistryCohabitants.data',
    [],
  ) as string[]

  const applicantName = getValueViaPath(
    externalData,
    'nationalRegistry.data.fullName',
  ) as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'nationalRegistry.data.nationalId',
  ) as string

  const applicantAddress = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.streetAddress',
  ) as string

  const applicantPostalCode = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.postalCode',
  ) as string

  const applicantLocality = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.locality',
  ) as string

  const applicantMunicipality = applicantPostalCode + ', ' + applicantLocality

  const hasSpouse = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data',
  ) as object

  const spouseName = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data.name',
  ) as string

  const spouseNationalId = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data.nationalId',
  ) as string

  const maritalStatus = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data.maritalStatus',
  ) as string

  return {
    residenceHistory,
    cohabitants,
    custodyInformation,
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantMunicipality,
    hasSpouse,
    spouseName,
    spouseNationalId,
    maritalStatus,
  }
}

export function getStartDateAndEndDate(
  nationalId: string,
  applicationType: ApplicationType,
) {
  // Applicant could apply from the 1st of the month after his/her 65 birthday
  // Until 6 month ahead
  const today = new Date()
  const nationalIdInfo = kennitala.info(nationalId)
  const dateOfBirth = new Date(nationalIdInfo.birthday)
  const age = nationalIdInfo.age
  const thisYearBirthday = new Date(
    today.getFullYear(),
    dateOfBirth.getMonth(),
    dateOfBirth.getDay(),
  )

  const thisYearAge = thisYearBirthday > today ? age + 1 : age
  const thisYearBirthdayPlusOneMonth = addMonths(thisYearBirthday, 1)
  const nextMonth = addMonths(today, 1)

  // startDate is 1st day of the month after birhday this year
  let startDate = addDays(
    thisYearBirthdayPlusOneMonth,
    thisYearBirthdayPlusOneMonth.getDay() + 1,
  )
  let endDate = addMonths(today, 6) // þarf að spyrja hvort það sé +6 eða +7

  if (thisYearAge >= oldAgePensionAge) {
    // >= 67 year old
    startDate = addYears(
      thisYearBirthdayPlusOneMonth > nextMonth
        ? thisYearBirthdayPlusOneMonth
        : nextMonth,
      -2,
    )
  } else if (thisYearAge < fishermenMinAge) {
    // < 62 year old
    return {}
  } else if (applicationType === ApplicationType.FISHERMEN) {
    // Fishermen
    if (thisYearAge === fishermenMinAge + 1) {
      // = 63 year old
      startDate = addYears(thisYearBirthdayPlusOneMonth, -1)
    } else if (thisYearAge > fishermenMinAge + 1) {
      // between 63 and 67
      startDate = addYears(
        thisYearBirthdayPlusOneMonth > nextMonth
          ? thisYearBirthdayPlusOneMonth
          : nextMonth,
        -2,
      )
    }
  } else {
    // not fishermen
    if (thisYearAge < earlyRetirementMinAge) {
      // < 65 year old
      return {}
    } else if (thisYearAge === earlyRetirementMinAge + 1) {
      // 66 year old
      startDate = addYears(thisYearBirthdayPlusOneMonth, -1)
    }
  }

  if (startDate > endDate) return {}

  return { startDate, endDate }
}

export function getAvailableYears(application: Application) {
  const { applicantNationalId } = getApplicationExternalData(
    application.externalData,
  )
  const { applicationType } = getApplicationAnswers(application.answers)

  if (!applicantNationalId) return []

  const { startDate, endDate } = getStartDateAndEndDate(
    applicantNationalId,
    applicationType,
  )
  if (!startDate || !endDate) return []

  const startDateYear = startDate.getFullYear()
  const endDateYear = endDate.getFullYear()

  return Array.from(Array(endDateYear - startDateYear + 1).keys()).map((x) => {
    const theYear = x + startDateYear
    return { value: theYear.toString(), label: theYear.toString() }
  })
}

export function getAvailableMonths(
  application: Application,
  selectedYear: string,
) {
  const { applicantNationalId } = getApplicationExternalData(
    application.externalData,
  )
  const { applicationType } = getApplicationAnswers(application.answers)

  if (!applicantNationalId) return []

  const { startDate, endDate } = getStartDateAndEndDate(
    applicantNationalId,
    applicationType,
  )
  if (!startDate || !endDate || !selectedYear) return []

  let months = MONTHS
  if (startDate.getFullYear().toString() === selectedYear) {
    months = months.slice(startDate.getMonth(), months.length + 1)
  } else if (endDate.getFullYear().toString() === selectedYear) {
    months = months.slice(0, endDate.getMonth() + 1)
  }

  return months.map((month) => {
    switch (month) {
      case 'January':
        return { value: month, label: oldAgePensionFormMessage.period.january }
      case 'February':
        return { value: month, label: oldAgePensionFormMessage.period.february }
      case 'March':
        return { value: month, label: oldAgePensionFormMessage.period.march }
      case 'April':
        return { value: month, label: oldAgePensionFormMessage.period.april }
      case 'May':
        return { value: month, label: oldAgePensionFormMessage.period.may }
      case 'June':
        return { value: month, label: oldAgePensionFormMessage.period.june }
      case 'July':
        return { value: month, label: oldAgePensionFormMessage.period.july }
      case 'Agust':
        return { value: month, label: oldAgePensionFormMessage.period.agust }
      case 'September':
        return {
          value: month,
          label: oldAgePensionFormMessage.period.september,
        }
      case 'October':
        return { value: month, label: oldAgePensionFormMessage.period.october }
      case 'November':
        return { value: month, label: oldAgePensionFormMessage.period.november }
      case 'December':
        return { value: month, label: oldAgePensionFormMessage.period.desember }
      default:
        return { value: '0', label: '' }
    }
  })
}

export function getAgeBetweenTwoDates(
  selectedDate: Date,
  dateOfBirth: Date,
): number {
  const diffTime = selectedDate.getTime() - dateOfBirth.getTime()
  const age = Math.abs(Math.floor(diffTime / (365.25 * 60 * 60 * 24 * 1000)))

  return age
}

export function isEarlyRetirement(
  answers: Application['answers'],
  externalData: Application['externalData'],
) {
  const { applicantNationalId } = getApplicationExternalData(externalData)
  const {
    selectedMonth,
    selectedYear,
    applicationType,
  } = getApplicationAnswers(answers)

  if (!selectedMonth || !selectedYear) return false

  const dateOfBirth = kennitala.info(applicantNationalId).birthday
  const dateOfBirth00 = new Date(
    dateOfBirth.getFullYear(),
    dateOfBirth.getMonth(),
  )
  const selectedDate = new Date(+selectedYear, MONTHS.indexOf(selectedMonth))

  const age = getAgeBetweenTwoDates(selectedDate, dateOfBirth00)

  return (
    age >= earlyRetirementMinAge &&
    age <= earlyRetirementMaxAge &&
    applicationType !== ApplicationType.FISHERMEN
  )
}

export function getAttachments(application: Application) {
  const getAttachmentsName = (
    attachmentsArr: fileType[] | undefined,
    type: string,
  ) => {
    if (attachmentsArr && attachmentsArr.length > 0) {
      attachmentsArr.map((attch) => {
        attachments.push(`${type} - ${attch?.name}`)
      })
    }
  }

  const { answers, externalData } = application
  const {
    applicationType,
    homeAllowanceChildren,
    homeAllowanceHousing,
    connectedApplications,
    employment,
  } = getApplicationAnswers(answers)
  const earlyRetirement = isEarlyRetirement(answers, externalData)
  const attachments: string[] = []

  // Early retirement, pension fund, fishermen
  const earlyPenFisher = answers.fileUploadEarlyPenFisher as earlyRetirementPensionfundFishermen
  getAttachmentsName(earlyPenFisher?.pension, 'lífeyrissjóðir')
  if (earlyRetirement) {
    getAttachmentsName(earlyPenFisher?.earlyRetirement, 'snemmtaka')
  }
  if (applicationType === ApplicationType.FISHERMEN) {
    getAttachmentsName(earlyPenFisher?.fishermen, 'sjómanna')
  }

  // leaseAgreement, schoolAgreement
  const leaseAgrSchoolConf = answers.fileUploadHomeAllowance as leaseAgreementSchoolConfirmation
  const isHomeAllowance = connectedApplications?.includes(
    ConnectedApplications.HOMEALLOWANCE,
  )
  if (homeAllowanceHousing === HomeAllowanceHousing.RENTER && isHomeAllowance) {
    getAttachmentsName(leaseAgrSchoolConf?.leaseAgreement, 'leigusamning')
  }
  if (homeAllowanceChildren === YES && isHomeAllowance) {
    getAttachmentsName(leaseAgrSchoolConf?.schoolConfirmation, 'skólavist')
  }

  // self-employed
  if (employment === Employment.SELFEMPLOYED) {
    const selfEmpoyed = answers.employer as selfEmployed
    getAttachmentsName(
      selfEmpoyed.selfEmployedAttachment,
      'sjálfstætt starfandi',
    )
  }

  return attachments
}

// return combine residence history if the applicant had domestic transport
export function getCombinedResidenceHistory(
  residenceHistory: NationalRegistryResidenceHistory[],
): combinedResidenceHistory[] {
  let combinedResidenceHistory: combinedResidenceHistory[] = []

  residenceHistory.map((history) => {
    if (combinedResidenceHistory.length === 0) {
      return combinedResidenceHistory.push(residenceMapper(history))
    }

    const priorResidence = combinedResidenceHistory.at(-1)
    if (priorResidence?.country !== history.country) {
      combinedResidenceHistory.at(-1)!.periodTo = history.dateOfChange!

      return combinedResidenceHistory.push(residenceMapper(history))
    }
  })

  return [...combinedResidenceHistory].reverse()
}

export function getYesNOOptions() {
  const options: Option[] = [
    {
      value: YES,
      label: oldAgePensionFormMessage.shared.yes,
    },
    {
      value: NO,
      label: oldAgePensionFormMessage.shared.no,
    },
  ]
  return options
}

export function isExistsCohabitantOlderThan25(
  externalData: Application['externalData'],
) {
  const { cohabitants, applicantNationalId } = getApplicationExternalData(
    externalData,
  )

  let isOlderThan25 = false
  cohabitants.forEach((cohabitant) => {
    if (cohabitant !== applicantNationalId) {
      if (kennitala.info(cohabitant).age > 25) {
        isOlderThan25 = true
      }
    }
  })

  return isOlderThan25
}

function residenceMapper(
  history: NationalRegistryResidenceHistory,
): combinedResidenceHistory {
  const residence = {} as combinedResidenceHistory
  residence.country = history.country!
  residence.periodFrom = history.dateOfChange!
  residence.periodTo = '-'

  return residence
}

export function residenceHistoryTableData(application: Application) {
  const { lang, formatMessage } = useLocale()
  const { residenceHistory } = getApplicationExternalData(
    application.externalData,
  )

  const combinedResidenceHistory = getCombinedResidenceHistory(
    [...residenceHistory].reverse(),
  )

  const formattedData =
    combinedResidenceHistory.map((history) => {
      return {
        country:
          lang === 'is'
            ? getCountryByCode(history.country)?.name_is
            : getCountryByCode(history.country)?.name,
        periodFrom: new Date(history.periodFrom).toLocaleDateString(),
        periodTo:
          history.periodTo !== '-'
            ? new Date(history.periodTo).toLocaleDateString()
            : '-',
        // lengthOfStay: 0//history.periodTo !== '-' ? formatDistance(history.periodTo as Date, history.periodFrom) : '-' //lengthOfStay(history.periodTo as Date, history.periodFrom)
      }
    }) ?? []

  const data = React.useMemo(() => [...formattedData], [formattedData])

  const columns = React.useMemo(
    () => [
      {
        Header: formatText(
          oldAgePensionFormMessage.residence.residenceHistoryCountryTableHeader,
          application,
          formatMessage,
        ),
        accessor: 'country',
      } as const,
      {
        Header: formatText(
          oldAgePensionFormMessage.residence
            .residenceHistoryPeriodFromTableHeader,
          application,
          formatMessage,
        ),
        accessor: 'periodFrom',
      } as const,
      {
        Header: formatText(
          oldAgePensionFormMessage.residence
            .residenceHistoryPeriodToTableHeader,
          application,
          formatMessage,
        ),
        accessor: 'periodTo',
      } as const,
      // {
      //   Header: formatText('Dvalartími (16-67 ára)', application, formatMessage),
      //   accessor: 'lengthOfStay',
      // } as const,
    ],
    [application, formatMessage],
  )

  return { data, columns }
}

export function childCustodyTableData(application: Application) {
  const { formatMessage } = useLocale()
  const { custodyInformation } = getApplicationExternalData(
    application.externalData,
  )

  const formattedData =
    custodyInformation.map((info) => {
      return {
        name: info.fullName,
        nationalId: kennitala.format(info.nationalId),
      }
    }) ?? []

  const data = React.useMemo(() => [...formattedData], [formattedData])

  const columns = React.useMemo(
    () => [
      {
        Header: formatText('Nafn', application, formatMessage),
        accessor: 'name',
      } as const,
      {
        Header: formatText('Kennitala', application, formatMessage),
        accessor: 'nationalId',
      } as const,
    ],
    [application, formatMessage],
  )

  return { data, columns }
}
