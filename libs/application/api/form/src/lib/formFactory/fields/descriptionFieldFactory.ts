import { DescriptionField } from '@island.is/application/types'
import { FieldDto } from '../../dto/form.dto'
import { IFieldFactory } from './IFormFieldFactory'

export class DescriptionFieldFactory implements IFieldFactory {
  createField(field: DescriptionField): FieldDto {
    const result: FieldDto = {
      id: field.id,
      description: field.description?.toString() ?? '',
      title: field.title?.toString() ?? '',
      type: field.type,
      component: field.component,
      specifics: {
        marginBottom: field.marginBottom?.toString() ?? '',
      },
    }
    return result
  }
}
