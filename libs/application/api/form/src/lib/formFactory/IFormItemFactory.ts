import { FormItem } from '../dto/form.dto'

export interface IFormItemFactory<T extends FormItem> {
  create(fieldData: any): T
}
