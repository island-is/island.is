import { IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDiscountCodeParams {
  @IsString()
  @Length(10, 10)
  @ApiProperty()
  readonly nationalId: string
}

export class GetDiscountByNationalIdParams {
  @IsString()
  @Length(10, 10)
  @ApiProperty()
  readonly nationalId: string
}
