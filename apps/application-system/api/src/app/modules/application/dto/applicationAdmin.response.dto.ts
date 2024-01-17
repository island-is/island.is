import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsBoolean, IsString, IsDate, IsArray, IsNumber } from 'class-validator'
import { BaseApplicationResponseDto } from './application.response.dto'

export class ApplicationListAdminResponseDto extends BaseApplicationResponseDto {
  @ApiPropertyOptional()
  @Expose()
  @IsString()
  applicantName?: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  paymentStatus?: string

  @ApiPropertyOptional()
  @Expose()
  @IsDate()
  pruneAt?: Date

  @ApiPropertyOptional()
  @Expose()
  @IsBoolean()
  pruned?: boolean

  constructor(partial: Partial<ApplicationListAdminResponseDto>) {
    super(partial)
    Object.assign(this, partial)
  }
}

export class ApplicationAdminPaginatedResponse {
  @ApiProperty({ type: [ApplicationListAdminResponseDto] })
  @Expose()
  @IsArray()
  rows!: ApplicationListAdminResponseDto[]

  @ApiProperty()
  @Expose()
  @IsNumber()
  count!: number
}
