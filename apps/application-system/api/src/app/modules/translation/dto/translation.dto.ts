import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateTranslationDto {
  @ApiProperty()
  @IsString()
  namespace!: string

  @ApiProperty()
  @IsString()
  messageKey!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  valueIs?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  valueEn?: string
}

export class TranslationItemDto {
  @ApiProperty()
  @IsString()
  namespace!: string

  @ApiProperty()
  @IsString()
  messageKey!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  valueIs?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  valueEn?: string
}

export class BulkUpdateTranslationsDto {
  @ApiProperty({ type: [TranslationItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationItemDto)
  translations!: TranslationItemDto[]
}

export class PublishTranslationsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string
}
