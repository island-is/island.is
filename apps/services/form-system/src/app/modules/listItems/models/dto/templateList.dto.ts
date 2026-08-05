import {
  type TemplateListType,
  TemplateListTypesEnum,
} from '@island.is/form-system/shared'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class TemplateListDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fieldId!: string

  @IsEnum(TemplateListTypesEnum)
  @ApiProperty({ enum: TemplateListTypesEnum })
  templateListType!: TemplateListType
}
