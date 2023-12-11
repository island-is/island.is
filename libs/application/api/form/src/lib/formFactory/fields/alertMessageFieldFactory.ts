import { AlertMessageField } from '@island.is/application/types'
import { FieldDto } from '../../dto/form.dto'
import { IFieldFactory } from './IFormFieldFactory'
import { Injectable } from '@nestjs/common'
import { ContextService } from '@island.is/application/api/core'

@Injectable()
export class AlertMessageFieldFactory implements IFieldFactory {
  constructor(private contextService: ContextService) {}

  createField(field: AlertMessageField): FieldDto {
    const result: FieldDto = {
      id: field.id,
      title: field.title ? this.contextService.formatText(field.title) : '',
      type: field.type,
      component: field.component,
      specifics: {
        alertType: field.alertType?.toString() ?? '',
        message: field.message
          ? this.contextService.formatText(field.message)
          : undefined,
        marginTop: field.marginTop?.toString() ?? 'auto',
        marginBottom: field.marginBottom?.toString() ?? 'auto',
      },
    }
    return result
  }
}
