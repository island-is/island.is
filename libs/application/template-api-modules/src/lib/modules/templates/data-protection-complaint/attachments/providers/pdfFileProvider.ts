import { Application } from '@island.is/application/core'
import { generateComplaintPdf } from '../../pdfGenerators/templates/complaintPdf'
import { DocumentInfo } from '@island.is/clients/data-protection-complaint'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PdfFileProvider {
  public async getApplicationPdf(
    application: Application,
    filename: string,
    attachedFiles: DocumentInfo[],
  ): Promise<DocumentInfo & { fileBuffer: Buffer }> {
    const buffer = await generateComplaintPdf(application, attachedFiles)
    const doc = {
      content: buffer.toString('base64'),
      fileName: `${filename}.pdf`,
      type: 'Kvörtun',
      subject: 'Kvörtun',
    } as DocumentInfo
    return { ...doc, fileBuffer: buffer }
  }
}
