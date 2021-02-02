import { IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateContactDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  email?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  phoneNumber?: string
}
