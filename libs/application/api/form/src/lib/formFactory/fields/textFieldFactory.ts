import { TextField } from '@island.is/application/types'
import { FieldDto } from '../../dto/form.dto'
import { IFieldFactory } from './IFormFieldFactory'
import { Injectable } from '@nestjs/common'
import { ContextService } from '@island.is/application/api/core'
import { getValueViaPath } from '@island.is/application/core'

@Injectable()
export class TextFieldFactory implements IFieldFactory {
  constructor(private readonly contextService: ContextService) {}

  createField(field: TextField): FieldDto {
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
    }
    return result
  }
}
