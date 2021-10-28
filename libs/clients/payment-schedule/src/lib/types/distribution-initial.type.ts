import { ScheduleType } from './schedule.enum'

export interface DistributionInitialPosition {
  nationalId: string
  scheduleType: ScheduleType
  minPayment: number
  maxPayment: number
  minCountMonth: number
  maxCountMonth: number
}

export interface DistributionInitialPositionResponse {
  distributionInitialPosition: DistributionInitialPosition
}

export interface DistributionInitialPositionRequest {
  nationalId: string
  totalAmount: number
  disposableIncome: number
  type: ScheduleType
}
