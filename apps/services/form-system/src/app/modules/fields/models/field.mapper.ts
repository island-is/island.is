import { Injectable } from '@nestjs/common'
import { UpdateFieldDto } from './dto/updateField.dto'
import { Field } from './field.model'

@Injectable()
export class FieldMapper {
  mapUpdateFieldDtoToField(field: Field, updateFieldDto: UpdateFieldDto): void {
    ;(field.name = updateFieldDto.name),
      (field.description = updateFieldDto.description),
      (field.isPartOfMultiset = updateFieldDto.isPartOfMultiset),
      (field.isRequired = updateFieldDto.isRequired),
      (field.fieldType = updateFieldDto.fieldType),
      (field.fieldSettings = updateFieldDto.fieldSettings)
  }
}
