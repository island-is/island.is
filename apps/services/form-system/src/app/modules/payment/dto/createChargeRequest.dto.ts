import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator'

class ChargeItemDto {
  @ApiProperty()
  @IsString()
  code!: string

  @ApiProperty({ required: false })
  @IsOptional()
  quantity?: number

  @ApiProperty({ required: false })
  @IsOptional()
  amount?: number
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
