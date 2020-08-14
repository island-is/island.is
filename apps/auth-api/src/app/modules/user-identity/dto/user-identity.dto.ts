import { IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UserIdentityDto {
  @IsString()
  @ApiProperty()
  readonly subjectId: string

  @IsString()
  @ApiProperty()
  readonly name: string

  @IsString()
  @ApiProperty()
  readonly providerName: string

  @IsString()
  @ApiProperty()
  readonly providerSubjectId: string
}
