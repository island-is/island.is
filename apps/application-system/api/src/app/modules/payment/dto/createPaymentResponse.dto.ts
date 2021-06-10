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
  application_id?: string

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
  definition?: string

  @ApiProperty()
  @Expose()
  @IsNumber()
  amount!: number

  @ApiProperty()
  @Expose()
  @IsDate()
  expires_at!: Date 
}