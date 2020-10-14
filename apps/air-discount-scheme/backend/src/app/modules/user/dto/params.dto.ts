import { IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetUserByDiscountCodeParams {
  @IsString()
  @Length(8, 8)
  @ApiProperty()
  readonly discountCode!: string
}

export class GetUserRelationsParams {
  @IsString()
  @Length(10, 10)
  @ApiProperty()
  readonly nationalId!: string
}
