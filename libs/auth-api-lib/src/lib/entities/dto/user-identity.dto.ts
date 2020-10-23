import { IsString, IsArray, IsBoolean, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ClaimDto } from './claim.dto'

export class UserIdentityDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_subject_id',
  })
  readonly subjectId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_name',
  })
  readonly name: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_provider_name',
  })
  readonly providerName: string

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_active',
  })
  readonly active: boolean

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_provider_subject_id',
  })
  readonly providerSubjectId: string

  @IsArray()
  @ApiProperty({ type: [ClaimDto] })
  readonly claims: ClaimDto[]
}
