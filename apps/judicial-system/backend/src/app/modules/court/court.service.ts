import { Injectable } from '@nestjs/common'

import { CourtClientService } from '@island.is/judicial-system/court-client'

@Injectable()
export class CourtService {
  constructor(private readonly courtClientService: CourtClientService) {}

  private uploadStream(
    courtId: string | undefined,
    fileName: string,
    contentType: string,
    content: Buffer,
  ): Promise<string> {
    return this.courtClientService.uploadStream(courtId ?? '', {
      value: content,
      options: { filename: fileName, contentType },
    })
  }

  async createRequest(
    courtId: string | undefined,
    courtCaseNumber: string | undefined,
    content: Buffer,
  ): Promise<string> {
    return this.uploadStream(
      courtId,
      'Krafa.pdf',
      'application/pdf',
      content,
    ).then((streamId) =>
      this.courtClientService.createDocument(courtId ?? '', {
        caseNumber: courtCaseNumber ?? '',
        subject: 'Krafa',
        fileName: 'Krafa.pdf',
        streamID: streamId,
        caseFolder: 'Krafa og greinargerð',
      }),
    )
  }

  async createCourtRecord(
    courtId: string | undefined,
    courtCaseNumber: string | undefined,
    fileName: string,
    content: Buffer,
  ): Promise<string> {
    return this.uploadStream(
      courtId,
      `${fileName}.pdf`,
      'application/pdf',
      content,
    ).then((streamId) =>
      this.courtClientService.createThingbok(courtId ?? '', {
        caseNumber: courtCaseNumber ?? '',
        subject: fileName,
        fileName: `${fileName}.pdf`,
        streamID: streamId,
      }),
    )
  }

  async createRuling(
    courtId: string | undefined,
    courtCaseNumber: string | undefined,
    fileName: string,
    content: Buffer,
  ): Promise<string> {
    return this.uploadStream(
      courtId,
      `${fileName}.pdf`,
      'application/pdf',
      content,
    ).then((streamId) =>
      this.courtClientService.createDocument(courtId ?? '', {
        caseNumber: courtCaseNumber ?? '',
        subject: fileName,
        fileName: `${fileName}.pdf`,
        streamID: streamId,
        caseFolder: 'Dómar, úrskurðir og Þingbók',
      }),
    )
  }

  async createDocument(
    courtId: string | undefined,
    courtCaseNumber: string | undefined,
    subject: string,
    fileName: string,
    fileType: string,
    content: Buffer,
  ): Promise<string> {
    return this.uploadStream(courtId, fileName, fileType, content).then(
      (streamId) =>
        this.courtClientService.createDocument(courtId ?? '', {
          caseNumber: courtCaseNumber ?? '',
          subject,
          fileName,
          streamID: streamId,
          caseFolder: 'Gögn málsins',
        }),
    )
  }
}
