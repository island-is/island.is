import { ScheduleType } from './schedule.enum'

export interface PaymentDistribution {
  nationalId: string
  scheduleType: ScheduleType
  payments: Payment[]
}

export interface Payment {
  dueDate: Date
  payment: number
  accumulated: number
}

export interface PaymentDistributionResponse {
  paymentDistribution: PaymentDistribution
}

export interface PaymentDistributionRequest {
  nationalId: string
  scheduleType: ScheduleType
  totalAmount: number
  monthAmount?: number | null
  monthCount?: number | null
}
