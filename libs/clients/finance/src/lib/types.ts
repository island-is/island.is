export type FinanceStatus = {
  message?: string
  timestamp: string
  principalTotals: number
  interestTotals: number
  costTotals: number
  statusTotals: number
  organizations: Array<any>
}

export type FinanceStatusDetails = {
  foo: string
}

export type CustomerChargeType = {
  chargeType: CustomerChargeTypeItem[]
}

export type CustomerChargeTypeItem = {
  id: string
  name: string
}

export type CustomerRecords = {
  records: CustomerRecordsDetails[]
}

export type CustomerRecordsDetails = {
  createDate: string
  createTime: string
  valueDate: string
  performingOrganization: string
  collectingOrganization: string
  chargeType: string
  itemCode: string
  chargeItemSubject: string
  periodType: string
  period: string
  amount: number
  category: string
  subCategory: string
  actionCategory?: string
  reference: string
  referenceToLevy: string
  accountReference: string
}

export type DocumentDataTypes = {
  type: string
  document: string
}

export type TapsControlTypes = {
  RecordsTap: boolean
  employeeClaimsTap: boolean
  localTaxTap: boolean
}

export type AnnualStatusTypes = {
  year: string
}

export type DocumentTypes = {
  docment: DocumentDataTypes
}

export type DocumentsListTypes = {
  documentsList: DocumentsListItemTypes[]
}

export type DocumentsListItemTypes = {
  id: string
  date: string
  type: string
  note?: string | null
  sender: string
  dateOpen: string
  amount: number
}

type ScheduleStatus = {
  S: string
  E: string
  L: string
}

export type PaymentSchedule = {
  approvalDate: string
  scheduleType: string
  scheduleName: string
  paymentCount: string
  scheduleStatus: ScheduleStatus
  scheduleNumber: string
  totalAmount: number
  unpaidAmount: number
  unpaidCount: string
  documentID: string
}

export type PaymentScheduleType = {
  myPaymentSchedule: {
    nationalId: string
    paymentSchedules: PaymentSchedule[]
  }
}

export type PaymentScheduleDetailPayment = {
  payAmount: number
  payAmountAccumulated: number
  payDate: string
  payExplanation: string
}

export type PaymentScheduleDetail = {
  paidAmount: number
  paidAmountAccumulated: number
  paidDate: string
  paymentNumber: string
  payments: PaymentScheduleDetailPayment[]
  plannedAmount: number
  plannedAmountAccumulated: number
  plannedDate: string
}

export type PaymentScheduleDetailType = {
  myDetailedSchedules: {
    myDetailedSchedule: PaymentScheduleDetail[]
  }
}
export type DebtStatus = {
  totalAmount: number
  approvedSchedule: number
  possibleToSchedule: number
  notPossibleToSchedule: number
}
export type DebtStatusType = {
  myDeptStatus: DebtStatus[]
}

export type DebtLessCertificateError = {
  code: string
  message: string
  help: string
  trackingId: string
  param: string
}
export type DebtLessCertificateType = {
  debtLessCertificateResult?: {
    debtLess: boolean
    certificate?: {
      type: string
      document: string
    }
  }
  error?: {
    code: number
    message: string
    errors: DebtLessCertificateError[]
  }
}
