import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ApplicantChildCustodyInformation,
  Option,
  YesOrNo,
  NationalRegistryResidenceHistory,
} from '@island.is/application/types'
import { ChildPensionRow, CombinedResidenceHistory } from '../types'
import {
  ChildPensionReason,
  NO,
  YES,
  AttachmentLabel,
  MAX_MONTHS_BACKWARD,
  MAX_MONTHS_FORWARD,
  MONTHS,
  MAX_MONTHS_RESIDENCE_HISTORY,
  IS,
} from './constants'
import { childPensionFormMessage } from './messages'
import { MessageDescriptor } from 'react-intl'
import addMonths from 'date-fns/addMonths'

interface FileType {
  key: string
  name: string
}

interface ChildPensionAttachments {
  maintenance?: FileType[]
  notLivesWithApplicant?: FileType[]
}
interface AdditionalInformation {
  additionalDocuments?: FileType[]
  additionalDocumentsRequired?: FileType[]
}

enum AttachmentTypes {
  MAINTENANCE = 'maintenance',
  NOT_LIVES_WITH_APPLICANT = 'notLivesWithApplicant',
  ADDITIONAL_DOCUMENTS = 'additionalDocuments',
}

interface Attachments {
  attachments: FileType[]
  label: MessageDescriptor
}

export function getApplicationAnswers(answers: Application['answers']) {
  const applicantEmail = getValueViaPath(
    answers,
    'applicantInfo.email',
  ) as string

  const applicantPhonenumber = getValueViaPath(
    answers,
    'applicantInfo.phonenumber',
  ) as string

  const registeredChildren = getValueViaPath(
    answers,
    'registerChildRepeater',
    [],
  ) as ChildPensionRow[]

  const selectedCustodyKids = getValueViaPath(
    answers,
    'chooseChildren.custodyKids',
    [],
  ) as []

  const selectedChildrenInCustody = getValueViaPath(
    answers,
    'chooseChildren.selectedChildrenInCustody',
    [],
  ) as ChildPensionRow[]

  const childPensionAddChild = getValueViaPath(
    answers,
    'childPensionAddChild',
    YES,
  ) as YesOrNo

  const selectedYear = getValueViaPath(answers, 'period.year') as string

  const selectedMonth = getValueViaPath(answers, 'period.month') as string

  const comment = getValueViaPath(answers, 'comment') as string

  const bank = getValueViaPath(answers, 'paymentInfo.bank') as string

  return {
    applicantEmail,
    applicantPhonenumber,
    registeredChildren,
    selectedCustodyKids,
    selectedChildrenInCustody,
    childPensionAddChild,
    selectedMonth,
    selectedYear,
    comment,
    bank,
  }
}

export function getApplicationExternalData(
  externalData: Application['externalData'],
) {
  const applicantName = getValueViaPath(
    externalData,
    'nationalRegistry.data.fullName',
  ) as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'nationalRegistry.data.nationalId',
  ) as string

  const custodyInformation = getValueViaPath(
    externalData,
    'childrenCustodyInformation.data',
    [],
  ) as ApplicantChildCustodyInformation[]

  const bank = getValueViaPath(externalData, 'paymentInfo.bank') as string
  const residenceHistory = getValueViaPath(
    externalData,
    'nationalRegistryResidenceHistory.data',
    [],
  ) as NationalRegistryResidenceHistory[]

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

  return {
    applicantName,
    applicantNationalId,
    custodyInformation,
    bank,
    residenceHistory,
    hasSpouse,
    spouseName,
    spouseNationalId,
  }
}

export function getChildPensionReasonOptions() {
  const options: Option[] = [
    {
      value: ChildPensionReason.PARENT_HAS_PENSION_OR_DISABILITY_ALLOWANCE,
      label:
        childPensionFormMessage.info
          .childPensionReasonParentHasPensionOrDisabilityAllowance,
    },
    {
      value: ChildPensionReason.PARENT_IS_DEAD,
      label: childPensionFormMessage.info.childPensionReasonParentIsDead,
    },
    {
      value: ChildPensionReason.CHILD_IS_FATHERLESS,
      label: childPensionFormMessage.info.childPensionReasonChildIsFatherless,
    },
    {
      value: ChildPensionReason.PARENTS_PENITENTIARY,
      label: childPensionFormMessage.info.childPensionReasonParentsPenitentiary,
    },
  ]
  return options
}

export function getAttachments(application: Application) {
  const getAttachmentDetails = (
    attachmentsArr: FileType[] | undefined,
    attachmentType: AttachmentTypes,
  ) => {
    if (attachmentsArr && attachmentsArr.length > 0) {
      attachments.push({
        attachments: attachmentsArr,
        label: AttachmentLabel[attachmentType],
      })
    }
  }

  const { answers, externalData } = application
  const { registeredChildren, childPensionAddChild } =
    getApplicationAnswers(answers)
  const attachments: Attachments[] = []

  const childPensionAttachments = answers.fileUpload as ChildPensionAttachments

  if (registeredChildren.length > 0 && childPensionAddChild !== NO) {
    getAttachmentDetails(
      childPensionAttachments?.maintenance,
      AttachmentTypes.MAINTENANCE,
    )
  }

  if (childCustodyLivesWithApplicant(answers, externalData)) {
    getAttachmentDetails(
      childPensionAttachments?.notLivesWithApplicant,
      AttachmentTypes.NOT_LIVES_WITH_APPLICANT,
    )
  }

  const additionalInfo =
    answers.fileUploadAdditionalFiles as AdditionalInformation

  const additionalDocuments = [
    ...(additionalInfo.additionalDocuments &&
    additionalInfo.additionalDocuments?.length > 0
      ? additionalInfo.additionalDocuments
      : []),
    ...(additionalInfo.additionalDocumentsRequired &&
    additionalInfo.additionalDocumentsRequired?.length > 0
      ? additionalInfo.additionalDocumentsRequired
      : []),
  ]

  if (additionalDocuments.length > 0) {
    getAttachmentDetails(
      additionalDocuments,
      AttachmentTypes.ADDITIONAL_DOCUMENTS,
    )
  }

  return attachments
}

// returns true if selected child DOES NOT live with applicant
export function childCustodyLivesWithApplicant(
  answers: Application['answers'],
  externalData: Application['externalData'],
) {
  let returnStatus = false
  const { selectedCustodyKids } = getApplicationAnswers(answers)
  const { custodyInformation } = getApplicationExternalData(externalData)

  selectedCustodyKids.map((i) =>
    custodyInformation.map((j) =>
      i === j.nationalId && !j.livesWithApplicant
        ? (returnStatus = true)
        : (returnStatus = false),
    ),
  )

  return returnStatus
}
export function getStartDateAndEndDate() {
  // Applicant could apply from the 2 year ago since 1st of next month
  // Until 6 month ahead
  const today = new Date()
  const nextMonth = addMonths(today, 1)

  const startDate = addMonths(nextMonth, MAX_MONTHS_BACKWARD)
  const endDate = addMonths(today, MAX_MONTHS_FORWARD)

  if (startDate > endDate) return {}

  return { startDate, endDate }
}

export function getAvailableMonths(selectedYear: string) {
  const { startDate, endDate } = getStartDateAndEndDate()

  if (!startDate || !endDate || !selectedYear) return []

  let months = MONTHS
  if (startDate.getFullYear().toString() === selectedYear) {
    months = months.slice(startDate.getMonth(), months.length + 1)
  } else if (endDate.getFullYear().toString() === selectedYear) {
    months = months.slice(0, endDate.getMonth() + 1)
  }

  return months
}

export function getAvailableYears() {
  const { startDate, endDate } = getStartDateAndEndDate()
  if (!startDate || !endDate) return []

  const startDateYear = startDate.getFullYear()
  const endDateYear = endDate.getFullYear()

  return Array.from(Array(endDateYear - startDateYear + 1).keys()).map((x) => {
    const theYear = x + startDateYear
    return { value: theYear.toString(), label: theYear.toString() }
  })
}

export function isMoreThan2Year(answers: Application['answers']) {
  const { selectedMonth, selectedYear } = getApplicationAnswers(answers)
  const today = new Date()
  const startDate = addMonths(today, MAX_MONTHS_BACKWARD)
  const selectedDate = new Date(selectedYear + selectedMonth)

  return startDate > selectedDate
}

export const formatBankInfo = (bankInfo: string) => {
  const formattedBankInfo = bankInfo.replace(/[^0-9]/g, '')
  if (formattedBankInfo && formattedBankInfo.length === 12) {
    return formattedBankInfo
  }

  return bankInfo
}

function residenceMapper(
  history: NationalRegistryResidenceHistory,
): CombinedResidenceHistory {
  const residence = {} as CombinedResidenceHistory

  if (history.country && history.dateOfChange) {
    residence.country = history.country
    residence.periodFrom = history.dateOfChange
    residence.periodTo = '-'
  }

  return residence
}

function isInTheRangeOfThreeYears(date: Date) {
  const today = new Date()
  const endDate = addMonths(today, MAX_MONTHS_RESIDENCE_HISTORY)

  return today >= date && date >= endDate
}

export function hasForeignResidencetInTheLastThreeYears(
  externalData: Application['externalData'],
) {
  const { residenceHistory } = getApplicationExternalData(externalData)

  const combinedResidenceHistory = getCombinedResidenceHistory(
    [...residenceHistory].reverse(),
  )

  return combinedResidenceHistory.some((residence) => residence.country !== IS)
}

// return combine residence history for the last three years
export function getCombinedResidenceHistory(
  residenceHistory: NationalRegistryResidenceHistory[],
): CombinedResidenceHistory[] {
  const combinedResidenceHistory: CombinedResidenceHistory[] = []

  residenceHistory.forEach((history) => {
    if (combinedResidenceHistory.length === 0) {
      return combinedResidenceHistory.push(residenceMapper(history))
    }

    const priorResidence = combinedResidenceHistory.at(-1)

    if (priorResidence && priorResidence?.country !== history.country) {
      priorResidence.periodTo = history.dateOfChange ?? '-'

      return combinedResidenceHistory.push(residenceMapper(history))
    }
  })

  return [
    ...combinedResidenceHistory.filter((l) =>
      isInTheRangeOfThreeYears(
        l.periodTo === '-' ? new Date() : new Date(l.periodTo),
      ),
    ),
  ].reverse()
}

export function convertDate(str: string) {
  var date = new Date(str),
    month = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2)
  return [date.getFullYear(), month, day].join("-")
}

export let monthNumberFromString = (str: string) => {
  return new Date(`${str} 01 2000`).toLocaleDateString(`en`, {month:`2-digit`})
}

