import {
  BadGatewayException,
  Inject,
  Injectable,
  UnsupportedMediaTypeException,
} from '@nestjs/common'

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
    return this.authenticateApi
      .authenticate(this.options[clientId])
      .then((res) => {
        // Strip the quotation marks from the result
        this.authenticationToken[clientId] = stripResult(res)
      })
      .catch(() => {
        // Cannot log the error as it contains username and password in plain text
        this.logger.error('Unable to log into the court service')

        throw new BadGatewayException('Unable to log into the court service')
      })
  }

  private async wrappedRequest(
    clientId: string,
    request: (authenticationToken: string) => Promise<string>,
    isRetry = false,
  ): Promise<string> {
    if (!this.authenticationToken[clientId] || isRetry) {
      await this.login(clientId)
    }

    return request(this.authenticationToken[clientId])
      .then((res) => stripResult(res))
      .catch((reason) => {
        const { statusCode, body } = reason as {
          statusCode: number
          body: string
        }

        if (
          !isRetry &&
          statusCode === 400 &&
          body?.startsWith('authenticationToken is expired')
        ) {
          this.logger.warn(
            'Error while calling the court service - attempting relogin',
            { reason },
          )

          return this.wrappedRequest(clientId, request, true)
        }

        const { status, statusText } = reason as {
          status: number
          statusText: string
        }

        if (status === 400 && statusText === 'FileNotSupported') {
          this.logger.warn('File type not supported', { reason })

          throw new UnsupportedMediaTypeException(
            reason,
            'Media type not supported',
          )
        } else {
          this.logger.error('Error while calling the court service', { reason })

          throw new BadGatewayException(
            reason,
            'Error while calling the court service',
          )
        }
      })
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
