import { createEnhancedFetch } from '@island.is/clients/middlewares'
import type { ConfigType } from '@island.is/nest/config'

import { Inject, Injectable } from '@nestjs/common'

import { FinancialStatementsInaoClientConfig } from './financialStatementsInao.config'
import { ClientType } from './models/ClientType'
import { Election } from './models/Election'

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
    const select = '$select=new_nationalid'
    const expand = '$expand=new_ClientType($select=new_name,new_code)'
    const filter = `$filter=new_nationalid eq '${nationalId}'`
    const url = `${this.basePath}/new_clients?${select}&${expand}&${filter}`
    const response = await this.fetch(url)
    const data = await response.json()

    if (!data || !data.value) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clientTypes: ClientType[] = data.value.map((x: any) => {
      return <ClientType>{
        code: x.new_ClientType.new_code,
        name: x.new_ClientType.new_name,
      }
    })

    if (clientTypes.length > 0) {
      return clientTypes[0]
    }
    return null
  }

  async getClientTypes() {
    const url = `${this.basePath}/new_clienttypes`
    const response = await this.fetch(url)
    const data = await response.json()

    if (!data || !data.value) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clientTypes: ClientType[] = data.value.map((x: any) => {
      return <ClientType>{
        clientTypeId: x.new_clienttypeid,
        code: x.new_code,
        name: x.new_name,
      }
    })

    return clientTypes
  }

  async getClientType(typeCode: string) {
    const filter = `$filter=new_code eq '${typeCode}'`
    const url = `${this.basePath}/new_clienttypes?${filter}`
    const response = await this.fetch(url)
    const data = await response.json()

    if (!data || !data.value) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clientTypes: ClientType[] = data.value.map((x: any) => {
      return <ClientType>{
        clientTypeId: x.new_clienttypeid,
        code: x.new_code,
        name: x.new_name,
      }
    })

    if (clientTypes.length > 0) {
      return clientTypes[0]
    }
    return null
  }

  async getElections() {
    const url = `${this.basePath}/new_elections`
    const response = await this.fetch(url)
    const data = await response.json()

    if (!data || !data.value) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elections: Election[] = data.value.map((x: any) => {
      return <Election>{
        electionId: x.new_electionid,
        name: x.new_name,
        electionDate: new Date(x.new_electiondate),
      }
    })

    return elections
  }
}
