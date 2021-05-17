import { BadGatewayException, Inject, Injectable } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  AuthenticateApi,
  AuthenticateRequest,
  CreateCaseApi,
  CreateCaseData,
  CreateCustodyCaseApi,
  CreateCustodyCaseRequest,
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

type CreateCustodyCaseArgs = Omit<
  CreateCustodyCaseRequest,
  'authenticationToken'
>

type CreateCaseArgs = Omit<CreateCaseData, 'authenticationToken'>

type CreateDocumentArgs = Omit<CreateDocumentData, 'authenticationToken'>

type CreateThingbokArgs = Omit<CreateThingbokRequest, 'authenticationToken'>

let authenticationToken: string

export const COURT_SERVICE_OPTIONS = 'export const COURT_SERVICE_OPTIONS'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CourtServiceOptions extends AuthenticateRequest {}

@Injectable()
export class CourtClientService {
  constructor(
    private readonly authenticateApi: AuthenticateApi,
    private readonly createCustodyCaseApi: CreateCustodyCaseApi,
    private readonly createCaseApi: CreateCaseApi,
    private readonly createDocumentApi: CreateDocumentApi,
    private readonly createThingbokApi: CreateThingbokApi,
    private readonly uploadStreamApi: UploadStreamApi,
    @Inject(COURT_SERVICE_OPTIONS)
    private readonly options: CourtServiceOptions,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async login() {
    try {
      const res = await this.authenticateApi.authenticate(this.options)

      // Strip the quotation marks from the result
      authenticationToken = stripResult(res)
    } catch (_) {
      // Cannot log the error as it contains username and password in plain text
      this.logger.error('Unable to log into the court service')

      throw new BadGatewayException('Unable to log into the court service')
    }
  }

  private async wrappedRequest(
    request: () => Promise<string>,
    isRetry = false,
  ): Promise<string> {
    if (!authenticationToken || isRetry) {
      await this.login()
    }

    try {
      const res = await request()

      return stripResult(res)
    } catch (error) {
      this.logger.error('Error while calling court service', error)

      if (isRetry) {
        throw error
      }

      return this.wrappedRequest(request, true)
    }
  }

  createCustodyCase(args: CreateCustodyCaseArgs): Promise<string> {
    return this.wrappedRequest(() =>
      this.createCustodyCaseApi.createCustodyCase({
        ...args,
        authenticationToken,
      }),
    )
  }

  createCase(args: CreateCaseArgs): Promise<string> {
    return this.wrappedRequest(() =>
      this.createCaseApi.createCase({
        createCaseData: {
          ...args,
          authenticationToken,
        },
      }),
    )
  }

  createDocument(args: CreateDocumentArgs): Promise<string> {
    return this.wrappedRequest(() =>
      this.createDocumentApi.createDocument({
        createDocumentData: {
          ...args,
          authenticationToken,
        },
      }),
    )
  }

  createThingbok(args: CreateThingbokArgs): Promise<string> {
    return this.wrappedRequest(() =>
      this.createThingbokApi.createThingbok({
        ...args,
        authenticationToken,
      }),
    )
  }

  uploadStream(file: {
    value: Buffer
    options?: {
      filename?: string
      contentType?: string
    }
  }): Promise<string> {
    return this.wrappedRequest(() =>
      this.uploadStreamApi.uploadStream(authenticationToken, file),
    )
  }
}
