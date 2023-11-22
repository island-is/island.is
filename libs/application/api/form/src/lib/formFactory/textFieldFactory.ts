import { TextField } from '../dto/form.dto'
import { IFieldFactory } from './IFormFieldFactory'

class TextFieldFactory implements IFieldFactory {
  createField(item: any): TextField {
    // The item parameter contains the data needed to create a TextField
    // For example, item could have properties like id and value
    return new TextField()
  }
}
