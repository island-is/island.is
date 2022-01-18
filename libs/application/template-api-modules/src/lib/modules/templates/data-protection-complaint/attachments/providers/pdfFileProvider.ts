import { Application } from '@island.is/application/core'
import { transformApplicationToComplaintDto } from '../../data-protection-utils'
import { generateComplaintPdf } from '../../pdfGenerators/templates/complaintPdf'
import { DocumentInfo } from '@island.is/clients/data-protection-complaint'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PdfFileProvider {
  public async getFiles(
    application: Application,
    filename: string,
  ): Promise<DocumentInfo[]> {
    const dto = transformApplicationToComplaintDto(application)
    const buffer = await generateComplaintPdf(dto)
    const doc = {
      content: buffer.toString('base64'),
      fileName: `${filename}.pdf`,
      type: 'Kvörtun',
    } as DocumentInfo
    return [doc]
  }
}
