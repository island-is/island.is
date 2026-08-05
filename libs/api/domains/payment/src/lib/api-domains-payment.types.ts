import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
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

export class ApiClientCallbackMetadata {
  @IsString()
  @ApiProperty()
  readonly applicationId!: string

  @IsString()
  @ApiProperty()
  readonly paymentId!: string
}

export class ApiClientCharge {
  @IsString()
  @ApiProperty()
  readonly created!: string

  @IsString()
  @ApiProperty()
  readonly modified!: string

  @IsString()
  @ApiProperty()
  readonly id!: string

  @IsString()
  @ApiProperty()
  readonly paymentFlowId!: string

  @IsString()
  @ApiProperty()
  readonly receptionId!: string

  @IsString()
  @ApiProperty()
  readonly user4!: string
}

export class ApiClientPayment {
  @IsString()
  @ApiProperty()
  readonly cardVR!: string

  @IsString()
  @ApiProperty()
  readonly acquirerReferenceNumber!: string

  @IsString()
  @ApiProperty()
  readonly transactionID!: string

  @IsString()
  @ApiProperty()
  readonly authorizationCode!: string

  @IsString()
  @ApiProperty()
  readonly transactionLifecycleId!: string

  @IsString()
  @ApiProperty()
  readonly maskedCardNumber!: string

  @IsBoolean()
  @ApiProperty()
  readonly isSuccess!: boolean

  @IsObject()
  @ApiProperty()
  readonly cardInformation!: object

  @IsString()
  @ApiProperty()
  readonly transactionType!: string

  @IsBoolean()
  @ApiProperty()
  readonly isCardPresent!: boolean

  @IsString()
  @ApiProperty()
  readonly currency!: string

  @IsString()
  @ApiProperty()
  readonly authenticationMethod!: string

  @IsNumber()
  @ApiProperty()
  readonly authorizedAmount!: number

  @IsObject()
  @ApiProperty()
  readonly marketInformation!: object

  @IsString()
  @ApiProperty()
  readonly authorizationIdentifier!: string

  @IsString()
  @ApiProperty()
  readonly eci!: string

  @IsString()
  @ApiProperty()
  readonly paymentAccountReference!: string

  @IsString()
  @ApiProperty()
  readonly authorizationExpiryDate!: string

  @IsString()
  @ApiProperty()
  readonly responseCode!: string

  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  readonly responseDescription?: string

  @IsString()
  @ApiProperty()
  readonly responseTime!: string

  @IsString()
  @ApiProperty()
  readonly correlationID!: string
}

export class ApiClientEventMetadata {
  @ValidateNested()
  @Type(() => ApiClientPayment)
  @ApiProperty()
  readonly payment!: ApiClientPayment

  @ValidateNested()
  @Type(() => ApiClientCharge)
  @ApiProperty()
  readonly charge!: ApiClientCharge
}
export class ApiClientPaymentDetails {
  @IsString()
  @ApiProperty()
  readonly paymentMethod!: string

  @IsString()
  @ApiProperty()
  readonly reason!: string

  @IsString()
  @ApiProperty()
  readonly message!: string

  @IsObject()
  @ApiProperty()
  readonly eventMetadata!: ApiClientEventMetadata
}

export class ApiClientCallback {
  @IsString()
  @ApiProperty()
  readonly type!: string

  @IsString()
  @ApiProperty()
  readonly paymentFlowId!: string

  @IsObject()
  @ApiProperty()
  readonly paymentFlowMetadata!: ApiClientCallbackMetadata

  @IsString()
  @IsDateString()
  @ApiProperty()
  readonly occurredAt!: string

  @ValidateNested()
  @Type(() => ApiClientPaymentDetails)
  @ApiProperty()
  readonly details!: ApiClientPaymentDetails
}
