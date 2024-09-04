import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApplicationTypes } from '@island.is/application/types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

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

export enum paidStatus {
  paid = 'paid',
  cancelled = 'cancelled',
  recreated = 'recreated',
  recreatedAndPaid = 'recreatedAndPaid',
}

export class Callback {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly receptionID!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly chargeItemSubject!: string

  @IsNotEmpty()
  @IsEnum(paidStatus)
  @ApiProperty({ enum: paidStatus })
  readonly status!: paidStatus
}
