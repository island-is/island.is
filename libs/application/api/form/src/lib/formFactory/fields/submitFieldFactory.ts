import { SubmitField } from '@island.is/application/types'
import { FieldDto } from '../../dto/form.dto'
import { IFieldFactory } from './IFormFieldFactory'
import { Injectable } from '@nestjs/common'
import { ContextService } from '@island.is/application/api/core'

@Injectable()
export class SubmitFieldFactory implements IFieldFactory {
  constructor(private readonly contextService: ContextService) {}

  createField(field: SubmitField): FieldDto {
    const context = this.contextService.getContext()

    const result: FieldDto = {
      id: field.id,
      description: field.description
        ? this.contextService.formatText(field.description)
        : undefined,
      title: this.contextService.formatText(field.title),
      type: field.type,
      component: field.component,
      specifics: {
        placement: field.placement,
        event: field.actions[0].event.toString(),
        name: this.contextService.formatText(field.actions[0].name),
        type: field.actions[0].type.toString(),
      },
    }
    return result
  }
}
