import { FieldDto } from '../../dto/form.dto'

export interface IFieldFactory {
  createField(fieldData: any): FieldDto
}
