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
  async createCase(_clientId: string, _args: CreateCaseArgs): Promise<string> {
    throw new ServiceUnavailableException('Court API is not available')
  }

  async createDocument(
    _clientId: string,
    _args: CreateDocumentArgs,
  ): Promise<string> {
    throw new ServiceUnavailableException('Court API is not available')
  }

  async createThingbok(
    _clientId: string,
    _args: CreateThingbokArgs,
  ): Promise<string> {
    throw new ServiceUnavailableException('Court API is not available')
  }

  async createEmail(
    _clientId: string,
    _args: CreateEmailArgs,
  ): Promise<string> {
    throw new ServiceUnavailableException('Court API is not available')
  }

  async uploadStream(
    _clientId: string,
    _args: UploadStreamArgs,
  ): Promise<string> {
    throw new ServiceUnavailableException('Court API is not available')
  }
}
