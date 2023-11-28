import { TextField } from '@island.is/application/types'
import { FieldDto } from '../../dto/form.dto'
import { IFieldFactory } from './IFormFieldFactory'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TextFieldFactory implements IFieldFactory {
  createField(field: TextField): FieldDto {
    const result: FieldDto = {
      id: field.id,
      description: field.description?.toString() ?? '',
      title: field.title?.toString() ?? '',
      type: field.type,
      component: field.component,
    }
    return result
  }
}
