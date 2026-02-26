import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger'

export class ApplicationAdminDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  created!: Date

  @ApiProperty()
  modified!: Date

  @ApiProperty()
  formId!: string

  @ApiPropertyOptional()
  formName?: string

  @ApiProperty()
  formSlug!: string

  @ApiProperty()
  applicant!: string

  @ApiPropertyOptional()
  applicantName?: string

  @ApiProperty()
  status!: string

  @ApiProperty()
  state!: string

  @ApiPropertyOptional()
  pruneAt?: Date

  @ApiPropertyOptional()
  pruned?: boolean

  @ApiPropertyOptional()
  institutionNationalId?: string

  @ApiPropertyOptional()
  institutionName?: string

  @ApiPropertyOptional()
  institutionContentfulSlug?: string
}
