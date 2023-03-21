import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsString } from 'class-validator'

export class CreateSessionDto {
  @IsString()
  @ApiProperty()
  id!: string

  @IsString()
  @ApiProperty()
  actorNationalId!: string

  @IsString()
  @ApiProperty()
  subjectNationalId!: string

  @IsString()
  @ApiProperty()
  clientId!: string

  @IsDateString()
  @ApiProperty()
  timestamp!: Date

  @IsString()
  @ApiProperty()
  userAgent!: string

  @IsString()
  @ApiProperty()
  ip!: string
}
