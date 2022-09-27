import { Injectable, ServiceUnavailableException } from '@nestjs/common'

import {
  CourtClientService,
  CreateCaseArgs,
  CreateDocumentArgs,
  CreateEmailArgs,
  CreateThingbokArgs,
  UploadStreamArgs,
} from './courtClient.service'

@Injectable()
export class CourtClientUnavailableService implements CourtClientService {
  async createCase(_courtId: string, _args: CreateCaseArgs): Promise<string> {
    throw new ServiceUnavailableException('Court API is not available')
  }

  async createDocument(
    _courtId: string,
    _args: CreateDocumentArgs,
  ): Promise<string> {
    throw new ServiceUnavailableException('Court API is not available')
  }

  async createThingbok(
    _courtId: string,
    _args: CreateThingbokArgs,
  ): Promise<string> {
    throw new ServiceUnavailableException('Court API is not available')
  }

  async createEmail(_courtId: string, _args: CreateEmailArgs): Promise<string> {
    throw new ServiceUnavailableException('Court API is not available')
  }

  async uploadStream(
    _courtId: string,
    _args: UploadStreamArgs,
  ): Promise<string> {
    throw new ServiceUnavailableException('Court API is not available')
  }
}
