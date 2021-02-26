import { BadGatewayException, Inject, Injectable } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  AuthenticateApi,
  CreateCustodyCaseApi,
} from '@island.is/judicial-system/court-client'

import { environment } from '../../../environments'
import { CreateCustodyCourtCaseResponse } from './models'

let authenticationToken: string

@Injectable()
export class CourtService {
  constructor(
    private readonly authenticateApi: AuthenticateApi,
    private readonly createCustodyCaseApi: CreateCustodyCaseApi,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async login() {
    try {
      authenticationToken = await this.authenticateApi.authenticate({
        username: environment.courtService.username,
        password: environment.courtService.password,
      })
    } catch (error) {
      this.logger.error('Unable to log into court service', error)

      throw new BadGatewayException(error)
    }
  }

  private async wrappedRequest(
    request: (authenticationToken: string) => Promise<string>,
    isRetry = false,
  ): Promise<string> {
    if (!authenticationToken || isRetry) {
      await this.login()
    }

    try {
      return await request(authenticationToken)
    } catch (error) {
      this.logger.error('Error while creating court case', error)
      if (isRetry) {
        throw error
      }

      return this.wrappedRequest(request, true)
    }
  }

  async createCustodyCourtCase(
    policeCaseNumber: string,
  ): Promise<CreateCustodyCourtCaseResponse> {
    const courtCaseNumber = await this.wrappedRequest(
      async (authenticationToken: string) =>
        this.createCustodyCaseApi.createCustodyCase({
          basedOn: 'Rannsóknarhagsmunir',
          sourceNumber: policeCaseNumber,
          authenticationToken,
        }),
    )

    this.logger.info(`Created court case ${courtCaseNumber}`)

    return { courtCaseNumber }
  }
}
