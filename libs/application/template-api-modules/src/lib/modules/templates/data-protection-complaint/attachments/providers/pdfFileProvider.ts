import { Application } from '@island.is/application/core'
import { transformApplicationToComplaintDto } from '../../data-protection-utils'
import { generateComplaintPdf } from '../../pdfGenerators/templates/complaintPdf'
import { FileProvider } from './fileProvider'
import { DocumentInfo } from '@island.is/clients/data-protection-complaint'

export class PdfFileProvider implements FileProvider {
  constructor(private application: Application, private filename: string) {}

  public async getFiles(): Promise<DocumentInfo[]> {
    const dto = transformApplicationToComplaintDto(this.application)
    const buffer = await generateComplaintPdf(dto)
    const doc = {
      content: buffer.toString('base64'),
      fileName: `${this.filename}.pdf`,
      type: 'Kvörtun',
    } as DocumentInfo
    return [doc]
  }
}
