import { IsEnum } from 'class-validator'
import { PDF_TYPES } from '@island.is/application/api-template-utils'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePdfDto {
  @ApiProperty({ enum: PDF_TYPES })
  @IsEnum(PDF_TYPES)
  readonly type!: PDF_TYPES
}
