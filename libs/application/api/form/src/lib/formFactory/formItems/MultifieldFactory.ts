import { FieldTypes, MultiField } from '@island.is/application/types'
import { FormItemDto } from '../../dto/form.dto'
import { IFormItemFactory } from './IFormItemFactory'
import { DescriptionFieldFactory } from '../fields/descriptionFieldFactory'
import { TextFieldFactory } from '../fields/textFieldFactory'
import { Injectable } from '@nestjs/common'
import { SubmitFieldFactory } from '../fields/submitFieldFactory'
import { PaymentPendingFieldFactory } from '../fields/paymentPendingFieldFactory'
import { AlertMessageFieldFactory } from '../fields/alertMessageFieldFactory'
import { LinkFieldFactory } from '../fields/linkFieldFactory'
import { MessageWithLinkButtonFieldFactory } from '../fields/messageWithLinkButtonFieldFactory'
import { ExpandableDescriptionFieldFactory } from '../fields/expandableDescriptionFieldFactory'
import { ContextService } from '@island.is/application/api/core'
import { PdfViewerFieldFactory } from '../fields/pdfViewerFieldFactory'

@Injectable()
export class MultiFieldFactory implements IFormItemFactory {
  constructor(
    private contextService: ContextService,
    private descriptionFieldFactory: DescriptionFieldFactory,
    private textFieldFactory: TextFieldFactory,
    private submitFieldFactory: SubmitFieldFactory,
    private paymentPendingFieldFactory: PaymentPendingFieldFactory,
    private alertMessageFieldFactory: AlertMessageFieldFactory,
    private linkFieldFactory: LinkFieldFactory,
    private messageWithLinkButtonFieldFactory: MessageWithLinkButtonFieldFactory,
    private expandableDescriptionFieldFactory: ExpandableDescriptionFieldFactory,
    private pdfViewerFieldFactory: PdfViewerFieldFactory,
  ) {}
  create(item: MultiField): FormItemDto {
    const title = this.contextService.formatText(item.title)

    const multiFieldDto: FormItemDto = {
      id: item.id ?? '',
      title: title,
      isPartOfRepeater: false,
      children: [],
      fields: [],
      type: item.type,
    }

    item.children.forEach((child) => {
      if (child.type === FieldTypes.DESCRIPTION) {
        multiFieldDto.fields = multiFieldDto.fields || []
        multiFieldDto.fields.push(
          this.descriptionFieldFactory.createField(child),
        )
      }

      if (child.type === FieldTypes.TEXT) {
        multiFieldDto.fields = multiFieldDto.fields || []
        multiFieldDto.fields.push(this.textFieldFactory.createField(child))
      }

      if (child.type === FieldTypes.SUBMIT) {
        multiFieldDto.fields = multiFieldDto.fields || []
        multiFieldDto.fields.push(this.submitFieldFactory.createField(child))
      }

      if (child.type === FieldTypes.PAYMENT_PENDING) {
        multiFieldDto.fields = multiFieldDto.fields || []
        multiFieldDto.fields.push(
          this.paymentPendingFieldFactory.createField(child),
        )
      }

      if (child.type === FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD) {
        multiFieldDto.fields = multiFieldDto.fields || []
        multiFieldDto.fields.push(
          this.messageWithLinkButtonFieldFactory.createField(child),
        )
      }

      if (child.type === FieldTypes.ALERT_MESSAGE) {
        multiFieldDto.fields = multiFieldDto.fields || []
        multiFieldDto.fields.push(
          this.alertMessageFieldFactory.createField(child),
        )
      }

      if (child.type === FieldTypes.LINK) {
        multiFieldDto.fields = multiFieldDto.fields || []
        multiFieldDto.fields.push(this.linkFieldFactory.createField(child))
      }

      if (child.type === FieldTypes.EXPANDABLE_DESCRIPTION) {
        multiFieldDto.fields = multiFieldDto.fields || []
        multiFieldDto.fields.push(
          this.expandableDescriptionFieldFactory.createField(child),
        )
      }

      if (child.type === FieldTypes.PDF_VIEWER) {
        multiFieldDto.fields = multiFieldDto.fields || []
        multiFieldDto.fields.push(this.pdfViewerFieldFactory.createField(child))
      }
    })

    return multiFieldDto
  }
}
