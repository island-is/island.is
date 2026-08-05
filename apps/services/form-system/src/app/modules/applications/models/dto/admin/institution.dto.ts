import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

export class InstitutionDto {
  @ApiProperty()
  @Expose()
  @IsString()
  nationalId!: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  @IsOptional()
  contentfulSlug?: string
}
