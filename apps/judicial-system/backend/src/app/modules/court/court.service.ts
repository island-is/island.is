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

  createThingbok(courtCaseNumber: string, streamId: string) {
    return this.courtClientService.createThingbok({
      caseNumber: courtCaseNumber,
      subject: 'Þingbók og úrskurður',
      fileName: 'Þingbók og úrskurður.pdf',
      streamID: streamId,
    })
  }

  uploadStream(pdf: Buffer): Promise<string> {
    return this.courtClientService.uploadStream({
      value: pdf,
      options: { filename: 'upload.pdf', contentType: 'application/pdf' },
    })
  }
}
