import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsBoolean, IsObject, IsString, IsNumber, IsDate } from 'class-validator'

export class CreatePaymentResponseDto {
  @Expose()
  @IsString()
  id!: string

  @ApiProperty()
  @Expose()
  @IsString()
  applicationId?: string

  @ApiProperty()
  @Expose()
  @IsBoolean()
  fulfilled?: boolean

  @ApiProperty()
  @Expose()
  @IsString()
  user4!: string

  @ApiProperty()
  @Expose()
  @IsObject()
  definition?: object

  @ApiProperty()
  @Expose()
  @IsNumber()
  amount!: number

  @ApiProperty()
  @Expose()
  @IsDate()
  expiresAt!: Date 
}