import { SubmitField } from '@island.is/application/types'
import { FieldDto } from '../../dto/form.dto'
import { IFieldFactory } from './IFormFieldFactory'
import { Injectable } from '@nestjs/common'
import { ContextService } from '@island.is/application/api/core'
import { getValueViaPath } from '@island.is/application/core'

@Injectable()
export class SubmitFieldFactory implements IFieldFactory {
  constructor(private readonly contextService: ContextService) {}

  createField(field: SubmitField): FieldDto {
    const context = this.contextService.getContext()

    const externalData = context.applicationData?.externalData
    if (!externalData) throw new Error('External data not found')
    const fullName = getValueViaPath(
      externalData,
      'nationalRegistry.data.fullName',
    ) as string

    const result: FieldDto = {
      id: field.id,
      description: field.description?.toString() ?? '',
      title: field.title?.toString() ?? '',
      type: field.type,
      component: field.component,
      defaultValue: fullName,
      specifics: {
        placement: field.placement,
        event: field.actions[0].event.toString(),
        name: field.actions[0].name.toString(),
        type: field.actions[0].type.toString(),
      },
    }
    return result
  }
}
