import { ApiProperty } from '@nestjs/swagger'
import { FieldDisplayOrderDto } from './fieldDisplayOrder.dto'

export class UpdateFieldsDisplayOrderDto {
  @ApiProperty({ type: [FieldDisplayOrderDto] })
  fieldsDisplayOrderDto!: FieldDisplayOrderDto[]
}
