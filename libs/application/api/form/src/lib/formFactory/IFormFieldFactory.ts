import { BaseField } from '../dto/form.dto'

export interface IFieldFactory {
  createField(fieldData: any): BaseField
}
