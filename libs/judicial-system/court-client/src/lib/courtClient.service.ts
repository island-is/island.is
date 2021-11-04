import { BadGatewayException, Inject, Injectable } from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import {
  AuthenticateApi,
  AuthenticateRequest,
  CreateCaseApi,
  CreateCaseData,
  CreateDocumentApi,
  CreateDocumentData,
  CreateThingbokApi,
  CreateThingbokRequest,
} from '../../gen/fetch'
import { UploadStreamApi } from './uploadStreamApi'

function stripResult(str: string): string {
  if (str[0] !== '"') {
    return str
  }

  return str.slice(1, str.length - 1)
}

type CreateCaseArgs = Omit<CreateCaseData, 'authenticationToken'>

type CreateDocumentArgs = Omit<CreateDocumentData, 'authenticationToken'>

type CreateThingbokArgs = Omit<CreateThingbokRequest, 'authenticationToken'>

export const COURT_CLIENT_SERVICE_OPTIONS = 'COURT_CLIENT_SERVICE_OPTIONS'

export interface CourtClientServiceOptions {
  [key: string]: AuthenticateRequest
}

@Injectable()
export class CourtClientService {
  private readonly authenticationToken: { [key: string]: string } = {}

  constructor(
    private readonly authenticateApi: AuthenticateApi,
    private readonly createCaseApi: CreateCaseApi,
    private readonly createDocumentApi: CreateDocumentApi,
    private readonly createThingbokApi: CreateThingbokApi,
    private readonly uploadStreamApi: UploadStreamApi,
    @Inject(COURT_CLIENT_SERVICE_OPTIONS)
    private readonly options: CourtClientServiceOptions,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async login(clientId: string) {
    try {
      const res = await this.authenticateApi.authenticate(
        this.options[clientId],
      )

      // Strip the quotation marks from the result
      this.authenticationToken[clientId] = stripResult(res)
    } catch (_) {
      // Cannot log the error as it contains username and password in plain text
      this.logger.error('Unable to log into the court service')

      throw new BadGatewayException('Unable to log into the court service')
    }
  }

  private async wrappedRequest(
    clientId: string,
    request: (authenticationToken: string) => Promise<string>,
    isRetry = false,
  ): Promise<string> {
    if (!this.authenticationToken[clientId] || isRetry) {
      await this.login(clientId)
    }

    try {
      const res = await request(this.authenticationToken[clientId])

      return stripResult(res)
    } catch (error) {
      if (isRetry) {
        this.logger.error('Error while calling the court service', error)

        throw error
      }

      this.logger.warn(
        'Error while calling the court service - attempting relogin',
        error,
      )

      return this.wrappedRequest(clientId, request, true)
    }
  }

  createCase(clientId: string, args: CreateCaseArgs): Promise<string> {
    return this.wrappedRequest(clientId, (authenticationToken) =>
      this.createCaseApi.createCase({
        createCaseData: {
          ...args,
          authenticationToken,
        },
      }),
    )
  }

  createDocument(clientId: string, args: CreateDocumentArgs): Promise<string> {
    return this.wrappedRequest(clientId, (authenticationToken) =>
      this.createDocumentApi.createDocument({
        createDocumentData: {
          ...args,
          authenticationToken,
        },
      }),
    )
  }

  createThingbok(clientId: string, args: CreateThingbokArgs): Promise<string> {
    return this.wrappedRequest(clientId, (authenticationToken) =>
      this.createThingbokApi.createThingbok({
        ...args,
        authenticationToken,
      }),
    )
  }

  uploadStream(
    clientId: string,
    file: {
      value: Buffer
      options?: {
        filename?: string
        contentType?: string
      }
    },
  ): Promise<string> {
    return this.wrappedRequest(clientId, (authenticationToken) =>
      this.uploadStreamApi.uploadStream(authenticationToken, file),
    )
  }
}
