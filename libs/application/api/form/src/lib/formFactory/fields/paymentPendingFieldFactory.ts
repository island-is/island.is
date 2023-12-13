import { PaymentPendingField } from '@island.is/application/types'
import { FieldDto } from '../../dto/form.dto'
import { IFieldFactory } from './IFormFieldFactory'
import { Injectable } from '@nestjs/common'
import { ContextService } from '@island.is/application/api/core'

@Injectable()
export class PaymentPendingFieldFactory implements IFieldFactory {
  constructor(private contextService: ContextService) {}
  createField(field: PaymentPendingField): FieldDto {
    const result: FieldDto = {
      id: field.id,
      title: this.contextService.formatText(field.title),
      type: field.type,
      component: field.component,
    }
    return result
  }
}
