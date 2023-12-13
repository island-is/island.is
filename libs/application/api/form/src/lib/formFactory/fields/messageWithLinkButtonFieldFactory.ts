import { MessageWithLinkButtonField } from '@island.is/application/types'
import { FieldDto } from '../../dto/form.dto'
import { IFieldFactory } from './IFormFieldFactory'
import { Injectable } from '@nestjs/common'
import { ContextService } from '@island.is/application/api/core'

@Injectable()
export class MessageWithLinkButtonFieldFactory implements IFieldFactory {
  constructor(private contextService: ContextService) {}

  createField(field: MessageWithLinkButtonField): FieldDto {
    const result: FieldDto = {
      id: field.id,
      description: field.description
        ? this.contextService.formatText(field.description)
        : '',
      title: field.title ? this.contextService.formatText(field.title) : '',
      type: field.type,
      component: field.component,
      specifics: {
        buttonTitle: field.buttonTitle
          ? this.contextService.formatText(field.buttonTitle)
          : undefined,
        message: field.message
          ? this.contextService.formatText(field.message)
          : undefined,
      },
    }
    return result
  }
}
