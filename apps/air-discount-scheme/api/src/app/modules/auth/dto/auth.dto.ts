import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class AuthDto {
  @IsString()
  @Length(10)
  @ApiProperty()
  readonly nationalId: string
}
