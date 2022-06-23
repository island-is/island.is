export type FinancePaymentScheduleItem = {
  approvalDate: string
  paymentCount: string
  scheduleName: string
  scheduleNumber: string
  scheduleStatus: string
  scheduleType: string
  totalAmount: number
}

export type FinancePaymentScheduleArray = {
  paymentSchedules: Array<FinancePaymentScheduleItem>
}
export type FinanceMyPaymentSchedule = {
  nationalId: string
  paymentSchedules: FinancePaymentScheduleArray
}

export type FinancePaymentScheduleQueryType = {
  getPaymentSchedule: {
    myPaymentSchedule: FinanceMyPaymentSchedule
  }
}
