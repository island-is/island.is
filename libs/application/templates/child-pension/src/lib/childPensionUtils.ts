import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ApplicantChildCustodyInformation,
  Option,
  YesOrNo,
} from '@island.is/application/types'
import { ChildPensionRow } from '../types'
import {
  ChildPensionReason,
  NO,
  YES,
  AttachmentLabel,
  MAX_MONTHS_BACKWARD,
  MAX_MONTHS_FORWARD,
  MONTHS,
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

enum AttachmentTypes {
  MAINTENANCE = 'maintenance',
  NOT_LIVES_WITH_APPLICANT = 'notLivesWithApplicant',
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
    bank
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

  return {
    applicantName,
    applicantNationalId,
    custodyInformation,
    bank
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