import { IsNumber, IsOptional, IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDiscountCodeParams {
  @IsString()
  @Length(10, 10)
  @ApiProperty()
  readonly nationalId!: string
}

export class GetCurrentDiscountByNationalIdParams {
  @IsString()
  @Length(10, 10)
  @ApiProperty()
  readonly nationalId!: string
}

export class CreateExplicitDiscountCodeParams {
  @IsString()
  @Length(10, 10)
  readonly nationalId!: string

  @IsString()
  readonly firstName!: string

  @IsString()
  @IsOptional()
  readonly middleName?: string

  @IsString()
  readonly lastName!: string

  @IsString()
  readonly gender!: 'kk' | 'hvk' | 'kvk'

  @IsString()
  readonly address!: string

  @IsNumber()
  readonly postalcode!: number

  @IsString()
  readonly city!: string
}
