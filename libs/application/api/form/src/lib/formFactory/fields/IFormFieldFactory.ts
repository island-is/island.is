import { Field } from '@island.is/application/types'
import { FieldDto } from '../../dto/form.dto'

export interface IFieldFactory {
  createField(fieldData: Field): FieldDto
}
