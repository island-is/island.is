import { IsDateString, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateSessionDto {
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
  sessionId!: string

  @IsString()
  @ApiProperty()
  userAgent!: string

  @IsString()
  @ApiProperty()
  ip!: string
}
