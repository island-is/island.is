import { formatISO } from 'date-fns'

import { BadGatewayException, Inject, Injectable } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  AuthenticateApi,
  CreateCustodyCaseApi,
  CreateCaseApi,
} from '@island.is/judicial-system/court-client'
import { CaseType } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'

let authenticationToken: string

function stripResult(str: string): string {
  return str.slice(1, str.length - 1)
}

@Injectable()
export class CourtService {
  constructor(
    private readonly authenticateApi: AuthenticateApi,
    private readonly createCustodyCaseApi: CreateCustodyCaseApi,
    private readonly createCaseApi: CreateCaseApi,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async login() {
    try {
      const str = await this.authenticateApi.authenticate({
        username: environment.courtService.username,
        password: environment.courtService.password,
      })

      authenticationToken = stripResult(str)
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
      return await request()
    } catch (error) {
      this.logger.error('Error while creating a court case', error)

      if (isRetry) {
        throw error
      }

      return this.wrappedRequest(request, true)
    }
  }

  async createCustodyCourtCase(policeCaseNumber: string): Promise<string> {
    const courtCaseNumber = await this.wrappedRequest(() =>
      this.createCustodyCaseApi.createCustodyCase({
        basedOn: 'Rannsóknarhagsmunir',
        sourceNumber: policeCaseNumber,
        authenticationToken,
      }),
    )

    return stripResult(courtCaseNumber)
  }

  async createCourtCase(
    type: CaseType,
    policeCaseNumber: string,
  ): Promise<string> {
    const courtCaseNumber = await this.wrappedRequest(() =>
      this.createCaseApi.createCase({
        createCaseData: {
          authenticationToken,
          caseType: 'R - Rannsóknarmál',
          subtype: type === CaseType.CUSTODY ? 'Gæsluvarðhald' : 'Farbann',
          status: 'Skráð',
          receivalDate: formatISO(new Date(), { representation: 'date' }),
          basedOn: 'Rannsóknarhagsmunir',
          sourceNumber: policeCaseNumber,
        },
      }),
    )

    return stripResult(courtCaseNumber)
  }
}
