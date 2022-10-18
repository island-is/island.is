import { Application } from '@island.is/application/types'
import { generateStatementPdf } from './pdfGenerators/templates/electionStatementPdf'
import { DocumentInfo } from '@island.is/clients/data-protection-complaint'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PdfFileProvider {
  public async getApplicationPdf(
    application: Application,
    filename: string,
  ): Promise<DocumentInfo & { fileBuffer: Buffer }> {
    const buffer = await generateStatementPdf(application)
    const doc = {
      content: buffer.toString('base64'),
      fileName: `${filename}.pdf`,
      type: 'Yfirlýsing',
      subject: 'Persónukjörs',
    } as DocumentInfo
    return { ...doc, fileBuffer: buffer }
  }
}
