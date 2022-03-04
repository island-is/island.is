import { Injectable } from '@nestjs/common'

import { CourtClientService } from '@island.is/judicial-system/court-client'

@Injectable()
export class CourtService {
  constructor(private readonly courtClientService: CourtClientService) {}

  createRequest(
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
      caseFolder: 'Krafa og greinargerð',
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
      subject: 'Þingbók og úrskurður',
      fileName: 'Þingbók og úrskurður.pdf',
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
