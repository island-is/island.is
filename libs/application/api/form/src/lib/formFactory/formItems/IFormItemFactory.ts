import { FormItemDto } from '../../dto/form.dto'

export interface IFormItemFactory {
  create(fieldData: any): FormItemDto
}
