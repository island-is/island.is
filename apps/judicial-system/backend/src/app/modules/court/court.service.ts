import { Injectable } from '@nestjs/common'

import { CourtClientService } from '@island.is/judicial-system/court-client'

@Injectable()
export class CourtService {
  constructor(private readonly courtClientService: CourtClientService) {}

  createRequest(
    courtId: string | undefined,
    courtCaseNumber: string | undefined,
    streamId: string,
  ): Promise<string> {
    return this.courtClientService.createDocument(courtId ?? '', {
      caseNumber: courtCaseNumber ?? '',
      subject: 'Krafa',
      fileName: 'Krafa.pdf',
      streamID: streamId,
      caseFolder: 'Krafa og greinargerð',
    })
  }

  createRuling(
    courtId: string | undefined,
    courtCaseNumber: string | undefined,
    streamId: string,
  ): Promise<string> {
    return this.courtClientService.createDocument(courtId ?? '', {
      caseNumber: courtCaseNumber ?? '',
      subject: 'Úrskurður',
      fileName: 'Úrskurður.pdf',
      streamID: streamId,
      caseFolder: 'Dómar, úrskurðir og Þingbók',
    })
  }

  createDocument(
    courtId: string | undefined,
    courtCaseNumber: string | undefined,
    subject: string,
    fileName: string,
    streamId: string,
  ): Promise<string> {
    return this.courtClientService.createDocument(courtId ?? '', {
      caseNumber: courtCaseNumber ?? '',
      subject,
      fileName,
      streamID: streamId,
      caseFolder: 'Gögn málsins',
    })
  }

  createThingbok(
    courtId: string | undefined,
    courtCaseNumber: string | undefined,
    streamId: string,
  ): Promise<string> {
    return this.courtClientService.createThingbok(courtId ?? '', {
      caseNumber: courtCaseNumber ?? '',
      subject: 'Þingbók',
      fileName: 'Þingbók.pdf',
      streamID: streamId,
    })
  }

  uploadStream(
    courtId: string | undefined,
    filename: string,
    contentType: string,
    content: Buffer,
  ): Promise<string> {
    return this.courtClientService.uploadStream(courtId ?? '', {
      value: content,
      options: { filename, contentType },
    })
  }
}
