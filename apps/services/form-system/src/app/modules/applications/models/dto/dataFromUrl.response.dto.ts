import { ApiPropertyOptional } from '@nestjs/swagger'
import { ListItemDto } from '../../../listItems/models/dto/listItem.dto'
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class DataFromUrlResDto {
  @ApiPropertyOptional({ type: [ListItemDto] })
  @IsOptional()
  @Type(() => ListItemDto)
  list?: ListItemDto[]

  @IsOptional()
  @ApiPropertyOptional({ type: LanguageType })
  @ValidateNested()
  @Type(() => LanguageType)
  placeholder?: LanguageType

  @IsBoolean()
  @ApiPropertyOptional()
  @IsOptional()
  isError?: boolean
}
