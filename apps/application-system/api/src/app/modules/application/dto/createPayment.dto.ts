import { IsString, IsNumber, IsDate, IsObject } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePaymentDto {
	@IsString()
  @ApiProperty()
  id!: string

	@IsString()
	@ApiProperty()
	readonly applicationId!: string

  @IsString()
	@ApiProperty()
	readonly fulfilled!: boolean

	@IsString()
	@ApiProperty()
	readonly user4!: string

  @IsObject()
  @ApiProperty()
  definition?: object

	@IsNumber()
	@ApiProperty()
	readonly amount!: number

	@IsDate()
	@ApiProperty()
	readonly expiresAt!: Date
}
