import { ScheduleType } from './schedule.enum'

export interface DebtSchedulesResponse {
  deptAndSchedules: DebtSchedules[]
}

export interface DebtSchedules {
  nationalId: string
  type: ScheduleType
  paymentSchedule: string
  organization: string
  explanation: string
  totalAmount: number
  chargetypes: ScheduleCharge[]
}

export interface ScheduleCharge {
  id: string
  name: string
  principal: number
  intrest: number
  expenses: number
  total: number
}
