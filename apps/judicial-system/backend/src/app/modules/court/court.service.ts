import { Injectable } from '@nestjs/common'

import { CourtClientService } from '@island.is/judicial-system/court-client'

@Injectable()
export class CourtService {
  constructor(private readonly courtClientService: CourtClientService) {}

  createDocument(courtCaseNumber: string, streamId: string): Promise<string> {
    return this.courtClientService.createDocument({
      caseNumber: courtCaseNumber,
      subject: 'Krafa',
      fileName: 'Krafa.pdf',
      streamID: streamId,
      caseFolder: 'Krafa og greinargerð',
    })
  }

  uploadStream(pdf: Buffer): Promise<string> {
    return this.courtClientService.uploadStream({
      value: pdf,
      options: { filename: 'Krafa.pdf', contentType: 'application/pdf' },
    })
  }
}
