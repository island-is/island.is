import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsString } from 'class-validator'

export class SessionDto {
  @IsString()
  @ApiProperty()
  actorNationalId!: string

  @IsString()
  @ApiProperty()
  subjectNationalId!: string

  @IsString()
  @ApiProperty()
  clientId!: string

  @Type(() => Date)
  @IsDate()
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
