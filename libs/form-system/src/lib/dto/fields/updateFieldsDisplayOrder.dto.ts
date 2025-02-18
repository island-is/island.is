import { ApiProperty } from '@nestjs/swagger'
import { FieldDisplayOrderDto } from './fieldDisplayOrder.dto'
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateFieldsDisplayOrderDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FieldDisplayOrderDto)
  @IsArray()
  @ApiProperty({ type: [FieldDisplayOrderDto] })
  fieldsDisplayOrderDto!: FieldDisplayOrderDto[]
}
