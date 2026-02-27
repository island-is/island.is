import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'

export class InstitutionDto {
  @ApiProperty()
  @Expose()
  @IsString()
  nationalId!: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  contentfulSlug?: string
}
