import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  IsBoolean,
  IsString,
  IsDate,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator'
import { BaseApplicationResponseDto } from './application.response.dto'

class ApplicationAdminData {
  @ApiProperty()
  @Expose()
  @IsString()
  label!: string

  @ApiProperty()
  @Expose()
  @IsString()
  key!: string

  @ApiPropertyOptional({ type: [String] })
  @Expose()
  @IsArray()
  @IsString({ each: true })
  values?: string[]
}

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

  @ApiPropertyOptional({ type: [ApplicationAdminData], default: [] })
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApplicationAdminData)
  adminData?: ApplicationAdminData[]

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

export class ApplicationStatistics {
  @ApiProperty()
  @Expose()
  @IsString()
  typeid!: string

  @ApiProperty()
  @Expose()
  @IsNumber()
  count!: number

  @ApiProperty()
  @Expose()
  @IsNumber()
  draft!: number

  @ApiProperty()
  @Expose()
  @IsNumber()
  inprogress!: number

  @ApiProperty()
  @Expose()
  @IsNumber()
  completed!: number

  @ApiProperty()
  @Expose()
  @IsNumber()
  rejected!: number

  @ApiProperty()
  @Expose()
  @IsNumber()
  approved!: number

  @ApiProperty()
  @Expose()
  @IsString()
  name?: string
}

export class ApplicationTypeAdmin {
  @ApiProperty()
  @Expose()
  @IsString()
  id!: string

  @ApiProperty()
  @Expose()
  @IsString()
  name?: string
}

export class ApplicationInstitution {
  @ApiProperty()
  @Expose()
  @IsString()
  nationalId!: string

  @ApiProperty()
  @Expose()
  @IsString()
  slug!: string

  @ApiProperty()
  @Expose()
  @IsString()
  contentfulId!: string

  @ApiProperty()
  @Expose()
  @IsArray()
  @IsString({ each: true })
  applicationTypes!: string[]
}
