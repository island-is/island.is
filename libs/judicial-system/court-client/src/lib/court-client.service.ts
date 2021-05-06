import { BadGatewayException, Inject, Injectable } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  AuthenticateApi,
  CreateCustodyCaseApi,
  CreateCaseApi,
  CreateCustodyCaseRequest,
  AuthenticateRequest,
  CreateCaseData,
} from '../../gen/fetch'

function stripResult(str: string): string {
  return str.slice(1, str.length - 1)
}

type CreateCustodyCaseArgs = Omit<
  CreateCustodyCaseRequest,
  'authenticationToken'
>

type CreateCaseArgs = Omit<CreateCaseData, 'authenticationToken'>

let authenticationToken: string

export const COURT_SERVICE_OPTIONS = 'export const COURT_SERVICE_OPTIONS'

export interface CourtServiceOptions extends AuthenticateRequest {}

@Injectable()
export class CourtClientService {
  constructor(
    private readonly authenticateApi: AuthenticateApi,
    private readonly createCustodyCaseApi: CreateCustodyCaseApi,
    private readonly createCaseApi: CreateCaseApi,
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
}
