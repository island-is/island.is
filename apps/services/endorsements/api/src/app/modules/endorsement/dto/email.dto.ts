import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer/decorators'
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator'

export class emailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  emailAddress!: string
}
