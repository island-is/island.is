import { ExpandableDescriptionField } from '@island.is/application/types'
import { FieldDto } from '../../dto/form.dto'
import { IFieldFactory } from './IFormFieldFactory'
import { Injectable } from '@nestjs/common'
import { ContextService } from '@island.is/application/api/core'

@Injectable()
export class ExpandableDescriptionFieldFactory implements IFieldFactory {
  constructor(private context: ContextService) {}

  createField(field: ExpandableDescriptionField): FieldDto {
    const result: FieldDto = {
      id: field.id,
      title: this.context.formatText(field.title),
      type: field.type,
      component: field.component,
      specifics: {
        introText: field.introText
          ? this.context.formatText(field.introText)
          : undefined,
        description: field.description
          ? this.context.formatText(field.description)
          : undefined,
        startExpanded: field.startExpanded ?? false,
      },
    }
    return result
  }
}
