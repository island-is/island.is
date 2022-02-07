import { Application } from '@island.is/application/core'
import { generateComplaintPdf } from '../../pdfGenerators/templates/complaintPdf'
import { DocumentInfo } from '@island.is/clients/data-protection-complaint'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PdfFileProvider {
  public async getFiles(
    application: Application,
    filename: string,
  ): Promise<DocumentInfo[]> {
    const buffer = await generateComplaintPdf(application)
    const doc = {
      content: buffer.toString('base64'),
      fileName: `${filename}.pdf`,
      type: 'Kvörtun',
    } as DocumentInfo
    return [doc]
  }
}
