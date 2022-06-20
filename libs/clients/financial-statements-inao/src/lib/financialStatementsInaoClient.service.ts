import { createEnhancedFetch } from '@island.is/clients/middlewares'
import type { ConfigType } from '@island.is/nest/config'

import { Inject, Injectable } from '@nestjs/common'

import { FinancialStatementsInaoClientConfig } from './financialStatementsInao.config'
import type { Client, Election } from './types'

@Injectable()
export class FinancialStatementsInaoClientService {
  constructor(
    @Inject(FinancialStatementsInaoClientConfig.KEY)
    private config: ConfigType<typeof FinancialStatementsInaoClientConfig>,
  ) {}

  basePath = this.config.basePath

  fetch = createEnhancedFetch({
    name: 'financialStatementsInao-odata',
    autoAuth: {
      issuer: this.config.issuer,
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
      scope: [this.config.scope],
      mode: 'token',
      tokenEndpoint: this.config.tokenEndpoint,
    },
  })

  async getUserClientType(nationalId: string) {
    const select = '$select=star_nationalid'
    const expand = '$expand=star_ClientType($select=star_name,star_code)'
    const filter = `$filter=star_nationalid eq '${nationalId}'`
    const url = `${this.basePath}/star_clients?${select}&${expand}&${filter}`
    const response = await this.fetch(url)
    const data = await response.json()

    if (!data || !data.value) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clientTypes: Client[] = data.value.map((x: any) => {
      return {
        code: x.star_ClientType.star_code,
        name: x.star_ClientType.star_name,
      }
    })

    if (clientTypes.length > 0) {
      return clientTypes[0]
    }
    return null
  }

  async getClientTypes() {
    const url = `${this.basePath}/star_clienttypes`
    const response = await this.fetch(url)
    const data = await response.json()

    if (!data || !data.value) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clientTypes: Client[] = data.value.map((x: any) => {
      return {
        clientTypeId: x.star_clienttypeid,
        code: x.star_code,
        name: x.star_name,
      }
    })

    return clientTypes
  }

  async getClientType(typeCode: string) {
    const filter = `$filter=star_code eq '${typeCode}'`
    const url = `${this.basePath}/star_clienttypes?${filter}`
    const response = await this.fetch(url)
    const data = await response.json()

    if (!data || !data.value) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clientTypes: Client[] = data.value.map((x: any) => {
      return {
        clientTypeId: x.star_clienttypeid,
        code: x.star_code,
        name: x.star_name,
      }
    })

    if (clientTypes.length > 0) {
      return clientTypes[0]
    }
    return null
  }

  async getElections() {
    const url = `${this.basePath}/star_elections`
    const response = await this.fetch(url)
    const data = await response.json()

    if (!data || !data.value) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elections: Election[] = data.value.map((x: any) => {
      return <Election>{
        electionId: x.star_electionid,
        name: x.star_name,
        electionDate: new Date(x.star_electiondate),
      }
    })

    return elections
  }
}
