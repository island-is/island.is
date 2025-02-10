import { IsEnum, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export interface ChargeResult {
  success: boolean
  error: Error | null
  data?: {
    paymentUrl: string
    user4: string
    receptionID: string
  }
}

export interface CallbackResult {
  success: boolean
  error: Error | null | string
  data?: Callback
}

export enum PaidStatus {
  paid = 'paid',
  cancelled = 'cancelled',
  recreated = 'recreated',
  recreatedAndPaid = 'recreatedAndPaid',
}

export class Callback {
  @IsString()
  @ApiProperty()
  readonly receptionID!: string

  @IsString()
  @ApiProperty()
  readonly chargeItemSubject!: string

  @IsEnum(PaidStatus)
  @ApiProperty({ enum: PaidStatus })
  readonly status!: PaidStatus
}
