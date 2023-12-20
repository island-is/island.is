import { PdfViewerField } from '@island.is/application/types'
import { FieldDto } from '../../dto/form.dto'
import { IFieldFactory } from './IFormFieldFactory'
import { Injectable } from '@nestjs/common'
import { ContextService } from '@island.is/application/api/core'

@Injectable()
export class PdfViewerFieldFactory implements IFieldFactory {
  constructor(private readonly contextService: ContextService) {}

  createField(field: PdfViewerField): FieldDto {
    const result: FieldDto = {
      id: field.id,
      description: field.description
        ? this.contextService.formatText(field.description)
        : undefined,
      title: this.contextService.formatText(field.title),
      type: field.type,
      component: field.component,
      specifics: {
        openMySitesLabel: this.contextService.formatText(
          field.openMySitesLabel,
        ),
        downloadPdfButtonLabel: this.contextService.formatText(
          field.downloadPdfButtonLabel,
        ),
        successTitle: this.contextService.formatText(field.successTitle),
        successDescription: this.contextService.formatText(
          field.successDescription,
        ),
        verificationDescription: this.contextService.formatText(
          field.verificationDescription,
        ),
        verificationLinkUrl: this.contextService.formatText(
          field.verificationLinkUrl,
        ),
        verificationLinkTitle: this.contextService.formatText(
          field.verificationLinkTitle,
        ),
        viewPdfButtonLabel: this.contextService.formatText(
          field.viewPdfButtonLabel,
        ),
        openInboxButtonLabel: this.contextService.formatText(
          field.openInboxButtonLabel,
        ),
        confirmationMessage: this.contextService.formatText(
          field.confirmationMessage,
        ),
        pdfKey: field.pdfKey,
      },
    }
    return result
  }
}
