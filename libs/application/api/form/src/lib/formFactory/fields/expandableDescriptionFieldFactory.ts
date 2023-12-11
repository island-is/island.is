import { ExpandableDescriptionField } from '@island.is/application/types'
import { FieldDto } from '../../dto/form.dto'
import { IFieldFactory } from './IFormFieldFactory'
import { Injectable } from '@nestjs/common'
import { ContextService } from '@island.is/application/api/core'
import { formatText } from '@island.is/application/core'

@Injectable()
export class ExpandableDescriptionFieldFactory implements IFieldFactory {
  constructor(private context: ContextService) {}

  createField(field: ExpandableDescriptionField): FieldDto {
    const { formatMessage, application } = this.context.getContext()

    const s = formatText(field.title, application, formatMessage)

    const result: FieldDto = {
      id: field.id,
      title: s,
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
