import { PaymentPendingField } from '@island.is/application/types'
import { FieldDto } from '../../dto/form.dto'
import { IFieldFactory } from './IFormFieldFactory'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PaymentPendingFieldFactory implements IFieldFactory {
  createField(field: PaymentPendingField): FieldDto {
    const result: FieldDto = {
      id: field.id,
      title: field.title?.toString() ?? '',
      type: field.type,
      component: field.component,
    }
    return result
  }
}
