import { IsString, IsArray, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ClaimDto } from './claim.dto'

export class UserIdentityDto {
  @IsString()
  @ApiProperty({
    example: "set_subject_id"
  })
  readonly subjectId: string

  @IsString()
  @ApiProperty({
    example: "set_name"
  })
  readonly name: string

  @IsString()
  @ApiProperty({
    example: "set_provider_name"
  })
  readonly providerName: string

  @IsString()
  @ApiProperty({
    example: "set_provider_subject_id"
  })
  readonly providerSubjectId: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null
  })
  readonly profileId: string

  @IsArray()
  @ApiProperty({ type: [ClaimDto]})
  readonly claims: ClaimDto[]
}
