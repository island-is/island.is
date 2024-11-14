import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ApplicationApplicantDto {
  @ApiProperty()
  id!: string

  @ApiProperty({ type: Date })
  created!: Date

  @ApiProperty({ type: Date })
  modified!: Date

  @ApiPropertyOptional()
  lastLogin?: Date

  @ApiProperty()
  name!: string

  @ApiProperty()
  nationalId!: string

  @ApiProperty()
  email!: string

  @ApiProperty()
  phoneNumber!: string

  @ApiProperty()
  address!: string

  @ApiProperty()
  municipality!: string

  @ApiProperty()
  applicantTypeId!: string
}
