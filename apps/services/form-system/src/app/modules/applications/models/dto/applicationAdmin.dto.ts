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

  @ApiProperty()
  applicant!: string

  @ApiProperty()
  status!: string

  @ApiProperty()
  state!: string

  @ApiPropertyOptional()
  pruneAt?: Date

  @ApiPropertyOptional()
  pruned?: boolean

  // @ApiProperty()
  // assignees!: string[]

  // @ApiProperty()
  // applicantActors!: string[]

  // @ApiPropertyOptional()
  // actionCard?: ActionCardMetaData

  // @ApiPropertyOptional()
  // name?: string

  // @ApiPropertyOptional()
  // institution?: string

  // @ApiPropertyOptional()
  // progress?: number

  // @ApiPropertyOptional()
  // applicantName?: string

  // @ApiPropertyOptional()
  // paymentStatus?: string

  // @ApiPropertyOptional()
  // adminData?: ApplicationAdminData[]
}
