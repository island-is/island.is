import fetch from 'node-fetch'

import { BadGatewayException, Inject, Injectable } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

let token: string

export const COURT_OPTIONS = 'COURT_OPTIONS'

export interface CourtServiceOptions {
  url: string
  xRoadClient: string
  username: string
  password: string
}

@Injectable()
export class CourtService {
  constructor(
    @Inject(COURT_OPTIONS)
    private readonly options: CourtServiceOptions,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private async login(): Promise<string> {
    const res = await fetch(
      `${this.options.url}/Authenticate?username=${this.options.username}&password=${this.options.password}`,
      {
        headers: { 'X-Road-Client': this.options.xRoadClient },
      },
    )

    return res.json()
  }

  private async wrappedPost(request: string, isRetry = false): Promise<string> {
    if (!token) {
      token = await this.login()
    }

    const res = await fetch(
      `${this.options.url}/${request}&authenticationToken=${token}`,
      {
        headers: { 'X-Road-Client': this.options.xRoadClient },
      },
    )

    if (res.ok) {
      return res.json()
    }

    if (isRetry) {
      throw new BadGatewayException('Court service not available')
    }

    this.logger.info('Court service retry')

    token = await this.login()

    return this.wrappedPost(request, true)
  }

  createCustodyCase(policeCaseNumber: string): Promise<string> {
    this.logger.debug(
      `Creating a court case for police case number ${policeCaseNumber}`,
    )

    return this.wrappedPost(
      `/CreateCustodyCase?basedOn=Rannsóknarhagsmunir&sourceNumber=${policeCaseNumber}`,
    )
  }
}
