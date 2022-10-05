/* eslint-disable @typescript-eslint/no-explicit-any */
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import { Inject, Injectable } from '@nestjs/common'

import { FinancialStatementsInaoClientConfig } from './financialStatementsInao.config'
import type {
  Client,
  Config,
  Election,
  FinancialType,
  KeyValue,
  PersonalElectionFinancialStatementValues,
} from './types'
import { ClientTypes } from './types'
import { lookup, LookupType } from './utils/lookup'

@Injectable()
export class FinancialStatementsInaoClientService {
  constructor(
    @Inject(FinancialStatementsInaoClientConfig.KEY)
    private config: ConfigType<typeof FinancialStatementsInaoClientConfig>,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
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

  async getClientTypes(): Promise<Client[] | null> {
    const url = `${this.basePath}/GlobalOptionSetDefinitions(Name='star_clienttypechoice')`
    const response = await this.fetch(url)
    const data = await response.json()

    if (!data || !data.Options) return null

    const clientTypes: Client[] = data.Options.map((x: any) => {
      return {
        value: x.Value,
        label: x.Label.UserLocalizedLabel.Label,
      }
    })

    return clientTypes
  }

  async getClientType(typeCode: string): Promise<Client | null> {
    const clientTypes = await this.getClientTypes()

    const found = clientTypes?.filter((x) => x.label === typeCode)

    if (found && found.length > 0) {
      return found[0]
    }
    return null
  }

  async getUserClientType(nationalId: string): Promise<Client | null> {
    const select = '$select=star_nationalid, star_name, star_type'
    const filter = `$filter=star_nationalid eq '${encodeURIComponent(
      nationalId,
    )}'`
    const url = `${this.basePath}/star_clients?${select}&${filter}`
    const response = await this.fetch(url)
    const data = await response.json()

    if (!data || !data.value) return null

    const typeValue = data.value.map((x: any) => {
      return x.star_type
    })

    if (!typeValue) {
      return null
    }

    const clientTypes = await this.getClientTypes()

    const found = clientTypes?.filter((x) => x.value === typeValue[0])

    if (found && found.length > 0) {
      return found[0]
    }
    return null
  }

  async getClientIdByNationalId(nationalId: string): Promise<string | null> {
    const select = '$select=star_nationalid, star_name, star_type'
    const filter = `$filter=star_nationalid eq '${encodeURIComponent(
      nationalId,
    )}'`
    const url = `${this.basePath}/star_clients?${select}&${filter}`
    const response = await this.fetch(url)
    const data = await response.json()

    if (!data || !data.value) return null

    const clientId = data.value.map((x: any) => {
      return x.star_clientid
    })

    if (clientId && clientId.length > 0) {
      return clientId[0]
    }

    return null
  }

  async createClient(
    nationalId: string,
    name: string,
    clientType: ClientTypes,
  ) {
    const url = `${this.basePath}/star_clients`

    const body = {
      star_nationalid: nationalId,
      star_type: clientType,
      star_name: name,
    }

    this.logger.debug('body', body)

    await this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    this.logger.debug('client created')
  }

  async getOrCreateClient(
    nationald: string,
    name: string,
    clientType: ClientTypes,
  ) {
    const res = await this.getClientIdByNationalId(nationald)

    if (!res) {
      await this.createClient(nationald, name, clientType)
      return await this.getClientIdByNationalId(nationald)
    }
    return res
  }

  async getElections(): Promise<Election[] | null> {
    const url = `${this.basePath}/star_elections`
    const response = await this.fetch(url)
    const data = await response.json()

    if (!data || !data.value) return null

    const elections: Election[] = data.value.map((x: any) => {
      return <Election>{
        electionId: x.star_electionid,
        name: x.star_name,
        electionDate: new Date(x.star_electiondate),
      }
    })

    return elections
  }

  async getClientFinancialLimit(
    clientType: string,
    year: string,
  ): Promise<number | null> {
    const select = '$select=star_value,star_years'
    const filter = `$filter=star_client_type eq ${clientType}`
    const url = `${this.basePath}/star_clientfinanciallimits?${select}&${filter}`
    const response = await this.fetch(url)
    const data = await response.json()

    if (!data || !data.value) return null

    const found = data.value.find((x: any) => x.star_years.includes(year))

    if (found) {
      return found.star_value
    }

    return null
  }

  async getFinancialTypes(): Promise<FinancialType[] | null> {
    const select =
      '$select=star_name,star_code,star_numeric,star_istaxinformation,star_supertype'
    const url = `${this.basePath}/star_financialtypes?${select}`
    const response = await this.fetch(url)
    const data = await response.json()

    if (!data || !data.value) return null

    const financialTypes: FinancialType[] = data.value.map((x: any) => {
      return <FinancialType>{
        numericValue: x.star_numeric,
        financialTypeId: x.star_financialtypeid,
      }
    })

    return financialTypes
  }

  async postFinancialStatementForPersonalElection(
    clientNationalId: string,
    actorNationalId: string | undefined,
    electionId: string,
    noValueStatement: boolean,
    clientName: string,
    values?: PersonalElectionFinancialStatementValues,
  ): Promise<boolean> {
    let financialValues: LookupType[] = []

    if (!noValueStatement && values) {
      const financialTypes = await this.getFinancialTypes()

      if (!financialTypes) {
        this.logger.error('Failed to get financial types')
        return false
      }

      const list: KeyValue[] = []
      list.push({ key: 100, value: values.contributionsByLegalEntities })
      list.push({ key: 101, value: values.individualContributions })
      list.push({ key: 102, value: values.candidatesOwnContributions })
      list.push({ key: 128, value: values.capitalIncome })
      list.push({ key: 129, value: values.otherIncome })
      list.push({ key: 130, value: values.electionOfficeExpenses })
      list.push({ key: 131, value: values.advertisingAndPromotions })
      list.push({ key: 132, value: values.meetingsAndTravelExpenses })
      list.push({ key: 139, value: values.otherExpenses })
      list.push({ key: 148, value: values.financialExpenses })
      list.push({ key: 150, value: values.fixedAssetsTotal })
      list.push({ key: 160, value: values.currentAssets })
      list.push({ key: 170, value: values.longTermLiabilitiesTotal })
      list.push({ key: 180, value: values.shortTermLiabilitiesTotal })
      list.push({ key: 190, value: values.equityTotal })

      financialValues = list.map((x) => {
        return lookup(x.key, x.value, financialTypes)
      })
    }

    const client = await this.getOrCreateClient(
      clientNationalId,
      clientName,
      ClientTypes.Individual,
    )

    const body = {
      'star_Election@odata.bind': `/star_elections(${electionId})`,
      star_representativenationalid: actorNationalId,
      'star_Client@odata.bind': `/star_clients(${client})`,
      star_novaluestatement: noValueStatement,
      star_financialstatementvalue_belongsto_rel: financialValues,
    }

    try {
      const url = `${this.basePath}/star_financialstatements`
      await this.fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      })
      return true
    } catch (error) {
      this.logger.info('body', body)
      this.logger.error('Failed to upload financial statement.', error)
    }
    return false
  }

  async postFinancialStatementForPoliticalParty(
    nationalId: string,
    actorNationalId: string | undefined,
    year: string,
    comment: string,
    keyValues: KeyValue[],
  ): Promise<boolean> {
    const financialTypes = await this.getFinancialTypes()

    if (!financialTypes) {
      this.logger.error('Failed to get financial types')
      return false
    }

    const values = keyValues.map((x) => {
      return lookup(x.key, x.value, financialTypes)
    })

    const clientId = await this.getClientIdByNationalId(nationalId)

    const body = {
      star_year: year,
      star_comment: comment,
      'star_Client@odata.bind': `/star_clients(${clientId})`,
      star_representativenationalid: actorNationalId,
      star_financialstatementvalue_belongsto_rel: values,
    }

    try {
      const url = `${this.basePath}/star_financialstatements`
      await this.fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      })
      return true
    } catch (error) {
      this.logger.info('body', body)
      this.logger.error('Failed to upload financial statement.', error)
    }
    return false
  }

  async postFinancialStatementForCemetery(
    clientNationalId: string,
    actorNationalId: string | undefined,
    year: string,
    comment: string,
    keyValues: KeyValue[],
  ): Promise<boolean> {
    const financialTypes = await this.getFinancialTypes()

    if (!financialTypes) {
      this.logger.error('Failed to get financial types')
      return false
    }

    const values = keyValues.map((x) => {
      return lookup(x.key, x.value, financialTypes)
    })

    const clientId = await this.getClientIdByNationalId(clientNationalId)

    const body = {
      star_year: year,
      star_comment: comment,
      'star_Client@odata.bind': `/star_clients(${clientId})`,
      star_representativenationalid: actorNationalId,
      star_financialstatementvalue_belongsto_rel: values,
    }

    try {
      const url = `${this.basePath}/star_financialstatements`
      await this.fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      })
      return true
    } catch (error) {
      this.logger.info('body', body)
      this.logger.error('Failed to upload financial statement.', error)
    }
    return false
  }

  async getConfig(): Promise<Config[]> {
    const select = '$select=star_key,star_value'
    const url = `${this.basePath}/star_configs?${select}`
    const response = await this.fetch(url)
    const data = await response.json()

    if (!data || !data.value) return []

    const config: Config[] = data.value.map((x: any) => {
      return <Config>{
        key: x.star_key,
        value: x.star_value,
      }
    })

    return config
  }
}
