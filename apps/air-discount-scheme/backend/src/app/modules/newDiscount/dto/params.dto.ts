import { IsBoolean, IsNumber, IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDiscountCodeParams {
  @IsString()
  @Length(10, 10)
  @ApiProperty()
  readonly nationalId!: string
}

export class CreateNewDiscountCodeBody {
  @IsString()
  readonly origin!: string

  @IsString()
  readonly destination!: string

  @IsBoolean()
  readonly isRoundTrip!: boolean
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
  readonly origin!: string

  @IsString()
  readonly destination!: string

  @IsBoolean()
  readonly isRoundTrip!: boolean

  @IsNumber()
  readonly postalcode!: number

  @IsString()
  readonly comment!: string

  @IsNumber()
  readonly numberOfDaysUntilExpiration!: number
}
