import { Injectable } from '@nestjs/common'

import { CourtClientService } from '@island.is/judicial-system/court-client'

@Injectable()
export class CourtService {
  constructor(private readonly courtClientService: CourtClientService) {}

  createDocument(
    courtId: string,
    courtCaseNumber: string,
    streamId: string,
  ): Promise<string> {
    return this.courtClientService.createDocument(courtId, {
      caseNumber: courtCaseNumber,
      subject: 'Krafa',
      fileName: 'Krafa.pdf',
      streamID: streamId,
      caseFolder: 'Krafa og greinargerð',
    })
  }

  createThingbok(courtId: string, courtCaseNumber: string, streamId: string) {
    return this.courtClientService.createThingbok(courtId, {
      caseNumber: courtCaseNumber,
      subject: 'Þingbók og úrskurður',
      fileName: 'Þingbók og úrskurður.pdf',
      streamID: streamId,
    })
  }

  uploadStream(courtId: string, pdf: Buffer): Promise<string> {
    return this.courtClientService.uploadStream(courtId, {
      value: pdf,
      options: { filename: 'upload.pdf', contentType: 'application/pdf' },
    })
  }
}
