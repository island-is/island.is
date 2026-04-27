import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

class ChargeItemDto {
  @ApiProperty()
  @IsString()
  chargeItemCode!: string

  @ApiProperty()
  @IsString()
  performingOrgID!: string

  @ApiProperty()
  @IsString()
  chargeType!: string

  @ApiProperty()
  @IsString()
  chargeItemName!: string

  @ApiProperty({ required: false })
  @IsNumber()
  priceAmount!: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  quantity?: number
}

export class CreateChargeRequestDto {
  @ApiProperty()
  @IsString()
  performingOrganizationID!: string

  @ApiProperty({ type: [ChargeItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChargeItemDto)
  chargeItems!: ChargeItemDto[]

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  locale?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  payerNationalId?: string
}

export class CreateChargeResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  paymentUrl!: string
}
