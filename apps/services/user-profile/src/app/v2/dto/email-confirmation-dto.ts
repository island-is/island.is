import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'

export class EmailConfirmationDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  readonly email!: string

  @ApiProperty()
  @IsString()
  @Length(3, 3)
  readonly code!: string
}
