import { IsString, Length, IsArray } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ClaimDto } from './claim.dto'

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

  @IsArray()
  @ApiProperty({ type: [ClaimDto]})
  readonly claims: ClaimDto[]
}
