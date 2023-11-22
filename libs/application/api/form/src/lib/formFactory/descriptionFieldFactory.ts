import { DescriptionField, TextField } from '../dto/form.dto'
import { IFieldFactory } from './IFormFieldFactory'

export class DescriptionFieldFactory implements IFieldFactory {
  createField(item: any): DescriptionField {
    // The item parameter contains the data needed to create a DescriptionField
    // For example, item could have properties like id and value
    return new DescriptionField()
  }
}
