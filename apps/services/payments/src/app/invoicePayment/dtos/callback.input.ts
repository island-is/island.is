import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEnum } from 'class-validator'
import { PaidStatus } from './paidStatus.enum'

export class CallbackInput {
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
