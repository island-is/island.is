/* eslint-disable @typescript-eslint/no-explicit-any */
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import { Inject, Injectable } from '@nestjs/common'

import { FinancialStatementsInaoClientConfig } from './financialStatementsInao.config'
import type {
  CemeteryFinancialStatementValues,
  Client,
  ClientType,
  Config,
  Contact,
  Election,
  ElectionInfo,
  FinancialType,
  KeyValue,
  PoliticalPartyFinancialStatementValues,
  TaxInfo,
  ContactDto,
  DigitalSignee,
  PersonalElectionSubmitInput,
} from './types'
import { ClientTypes, ContactType } from './types'
import { hasReachedAge } from './utils/ageUtil'
import {
  getCemeteryFileName,
  getPersonalElectionFileName,
  getPoliticalPartyFileName,
} from './utils/filenames'
import { lookup, LookupType } from './utils/lookup'

type FinancialLimit = {
  year: number
  limit: number
}

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
    timeout: 30000,
  })

  async getClientTypes(): Promise<ClientType[] | null> {
    const url = `${this.basePath}/GlobalOptionSetDefinitions(Name='star_clienttypechoice')`
    const data = await this.getData(url)

    if (!data || !data.Options) return null

    const clientTypes: ClientType[] = data.Options.map((x: any) => {
      return {
        value: x.Value,
        label: x.Label.UserLocalizedLabel.Label,
      }
    })

    return clientTypes
  }

  async getClientType(typeCode: string): Promise<ClientType | null> {
    const clientTypes = await this.getClientTypes()

    const found = clientTypes?.filter((x) => x.label === typeCode)

    if (found && found.length > 0) {
      return found[0]
    }
    return null
  }

  async getUserClientType(nationalId: string): Promise<ClientType | null> {
    const select = '$select=star_nationalid,star_name,star_type'
    const filter = `$filter=star_nationalid eq '${encodeURIComponent(
      nationalId,
    )}'`
    const url = `${this.basePath}/star_clients?${select}&${filter}`
    const data = await this.getData(url)

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
    const select = '$select=star_nationalid,star_name,star_type'
    const filter = `$filter=star_nationalid eq '${encodeURIComponent(
      nationalId,
    )}'`
    const url = `${this.basePath}/star_clients?${select}&${filter}`
    const data = await this.getData(url)

    if (!data || !data.value) return null

    const clientId = data.value.map((x: any) => {
      return x.star_clientid
    })

    if (clientId && clientId.length > 0) {
      return clientId[0]
    }

    return null
  }

  async createClient(client: Client, clientType: ClientTypes) {
    const url = `${this.basePath}/star_clients`

    const body = {
      star_nationalid: client.nationalId,
      star_type: clientType,
      star_name: client.name,
      star_phone: client.phone,
      star_email: client.email,
    }

    await this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  async getOrCreateClient(client: Client, clientType: ClientTypes) {
    const res = await this.getClientIdByNationalId(client.nationalId)

    if (!res) {
      await this.createClient(client, clientType)
      return await this.getClientIdByNationalId(client.nationalId)
    }
    return res
  }

  async getElections(nationalId: string): Promise<Election[] | null> {
    const url = `${this.basePath}/star_elections`
    const data = await this.getData(url)

    if (!data || !data.value) return null

    const elections: Election[] = data.value
      .filter((x: any) => x.star_open)
      .map((x: any) => {
        return {
          electionId: x.star_electionid,
          name: x.star_name,
          electionDate: new Date(x.star_electiondate),
          genitiveName: x.star_genitive_name,
          minimumAge: x.star_minimumage,
        }
      })

    return elections.filter((x) =>
      hasReachedAge(nationalId, x.electionDate, x.minimumAge),
    )
  }

  async getElectionInfo(electionId: string): Promise<ElectionInfo | null> {
    const select = '$select=star_electiontype, star_electiondate'
    const url = `${this.basePath}/star_elections(${electionId})?${select}`
    const data = await this.getData(url)

    if (!data) return null

    return {
      electionType: data.star_electiontype,
      electionDate: data.star_electiondate,
    } as ElectionInfo
  }

  async getClientFinancialLimit(
    clientType: string,
    year: string,
  ): Promise<number | null> {
    const select = '$select=star_value,star_year'
    const filter = `$filter=star_client_type eq ${clientType}`
    const url = `${this.basePath}/star_clientfinanciallimits?${select}&${filter}`
    const data = await this.getData(url)

    if (!data || !data.value) return null

    const found = data.value.find((x: any) => x.star_year == year)

    if (found) {
      return found.star_value
    }

    return null
  }

  async getAllClientFinancialLimits(
    clientType: number,
  ): Promise<Array<FinancialLimit> | null> {
    const select = '$select=star_value,star_year'
    const filter = `$filter=star_client_type eq ${clientType}`
    const url = `${this.basePath}/star_clientfinanciallimits?${select}&${filter}`
    const data = await this.getData(url)

    if (!data || !data.value) return null

    const financialLimits: FinancialLimit[] = data.value.map((x: any) => {
      return {
        year: x.star_year,
        limit: x.star_value,
      }
    })

    return financialLimits
  }

  async getFinancialTypes(): Promise<FinancialType[] | null> {
    const select =
      '$select=star_name,star_code,star_numeric,star_istaxinformation,star_supertype'
    const url = `${this.basePath}/star_financialtypes?${select}`
    const data = await this.getData(url)

    if (!data || !data.value) return null

    const financialTypes: FinancialType[] = data.value.map((x: any) => {
      return {
        numericValue: x.star_numeric,
        financialTypeId: x.star_financialtypeid,
      }
    })

    return financialTypes
  }

  async postFinancialStatementForPersonalElection(
    input: PersonalElectionSubmitInput,
  ): Promise<boolean> {
    const financialValues: LookupType[] = []
    if (!input.noValueStatement && input.values) {
      const financialTypes = await this.getFinancialTypes()
      if (!financialTypes) {
        this.logger.error('Failed to get financial types')
        return false
      }
      const list: KeyValue[] = []
      list.push({ key: 100, value: input.values.contributionsByLegalEntities })
      list.push({ key: 101, value: input.values.individualContributions })
      list.push({ key: 102, value: input.values.candidatesOwnContributions })
      list.push({ key: 128, value: input.values.capitalIncome })
      list.push({ key: 129, value: input.values.otherIncome })
      list.push({ key: 130, value: input.values.electionOfficeExpenses })
      list.push({ key: 131, value: input.values.advertisingAndPromotions })
      list.push({ key: 132, value: input.values.meetingsAndTravelExpenses })
      list.push({ key: 139, value: input.values.otherExpenses })
      list.push({ key: 148, value: input.values.financialExpenses })
      list.push({ key: 150, value: input.values.fixedAssetsTotal })
      list.push({ key: 160, value: input.values.currentAssets })
      list.push({ key: 170, value: input.values.longTermLiabilitiesTotal })
      list.push({ key: 180, value: input.values.shortTermLiabilitiesTotal })
      list.push({ key: 190, value: input.values.equityTotal })

      list.forEach((x) => {
        financialValues.push(lookup(x.key, x.value, financialTypes))
      })
    }

    const dataverseClientId = await this.getOrCreateClient(
      input.client,
      ClientTypes.Individual,
    )

    const actors = input.actor ? [input.actor] : undefined

    const body = {
      'star_Election@odata.bind': `/star_elections(${input.electionId})`,
      star_representativenationalid: input.actor?.nationalId,
      'star_Client@odata.bind': `/star_clients(${dataverseClientId})`,
      star_novaluestatement: input.noValueStatement,
      star_financialstatementvalue_belongsto_rel: financialValues,
      star_statement_contacts: actors,
      star_email: input.digitalSignee.email,
      star_phone: input.digitalSignee.phone,
    }

    const financialStatementId = await this.postFinancialStatement(body)

    if (!financialStatementId) {
      throw new Error('FinancialStatementId can not be null')
    }

    if (input.file) {
      const electionInfo = await this.getElectionInfo(input.electionId)

      const fileName = getPersonalElectionFileName(
        input.client.nationalId,
        electionInfo?.electionType,
        electionInfo?.electionDate,
        input.noValueStatement,
      )

      await this.sendFile(financialStatementId, fileName, input.file)
    }

    return true
  }

  async postFinancialStatementForPoliticalParty(
    client: Client,
    contacts: Contact[],
    digitalSignee: DigitalSignee,
    year: string,
    comment: string,
    values: PoliticalPartyFinancialStatementValues,
    file?: string,
  ): Promise<boolean> {
    const financialTypes = await this.getFinancialTypes()

    if (!financialTypes) {
      this.logger.error('Failed to get financial types')
      return false
    }

    const list: KeyValue[] = []
    list.push({ key: 200, value: values.contributionsFromTheTreasury })
    list.push({ key: 201, value: values.parliamentaryPartySupport })
    list.push({ key: 202, value: values.municipalContributions })
    list.push({ key: 203, value: values.contributionsFromLegalEntities })
    list.push({ key: 204, value: values.contributionsFromIndividuals })
    list.push({ key: 205, value: values.generalMembershipFees })
    list.push({ key: 228, value: values.capitalIncome })
    list.push({ key: 229, value: values.otherIncome })
    list.push({ key: 230, value: values.officeOperations })
    list.push({ key: 239, value: values.otherOperatingExpenses })
    list.push({ key: 248, value: values.financialExpenses })
    list.push({ key: 250, value: values.fixedAssetsTotal })
    list.push({ key: 260, value: values.currentAssets })
    list.push({ key: 270, value: values.longTermLiabilitiesTotal })
    list.push({ key: 280, value: values.shortTermLiabilitiesTotal })
    list.push({ key: 290, value: values.equityTotal })

    const financialValues: LookupType[] = []
    list.forEach((x) => {
      financialValues.push(lookup(x.key, x.value, financialTypes))
    })

    const clientId = await this.getClientIdByNationalId(client.nationalId)

    const actor = contacts.find((x) => x.contactType === ContactType.Actor)

    const contactsDto = this.convertContacts(contacts)

    const body = {
      star_year: year,
      star_comment: comment,
      'star_Client@odata.bind': `/star_clients(${clientId})`,
      star_representativenationalid: actor?.nationalId,
      star_financialstatementvalue_belongsto_rel: financialValues,
      star_statement_contacts: contactsDto,
      star_email: digitalSignee.email,
      star_phone: digitalSignee.phone,
    }

    const financialStatementId = await this.postFinancialStatement(body)

    if (!financialStatementId) {
      throw new Error('FinancialStatementId can not be null')
    }

    if (file) {
      const fileName = getPoliticalPartyFileName(client.nationalId, year)
      await this.sendFile(financialStatementId, fileName, file)
    }

    return true
  }

  async postFinancialStatementForCemetery(
    client: Client,
    contacts: Contact[],
    digitalSignee: DigitalSignee,
    year: string,
    comment: string,
    values: CemeteryFinancialStatementValues,
    file?: string,
  ): Promise<boolean> {
    const financialTypes = await this.getFinancialTypes()

    if (!financialTypes) {
      this.logger.error('Failed to get financial types')
      return false
    }

    const list: KeyValue[] = []
    list.push({ key: 300, value: values.careIncome })
    list.push({ key: 301, value: values.burialRevenue })
    list.push({ key: 302, value: values.grantFromTheCemeteryFund })
    list.push({ key: 328, value: values.capitalIncome })
    list.push({ key: 329, value: values.otherIncome })
    list.push({ key: 330, value: values.salaryAndSalaryRelatedExpenses })
    list.push({ key: 331, value: values.funeralExpenses })
    list.push({ key: 332, value: values.operationOfAFuneralChapel })
    list.push({ key: 334, value: values.donationsToCemeteryFund })
    list.push({ key: 335, value: values.contributionsAndGrantsToOthers })
    list.push({ key: 339, value: values.otherOperatingExpenses })
    list.push({ key: 348, value: values.financialExpenses })
    list.push({ key: 349, value: values.depreciation })
    list.push({ key: 350, value: values.fixedAssetsTotal })
    list.push({ key: 360, value: values.currentAssets })
    list.push({ key: 370, value: values.longTermLiabilitiesTotal })
    list.push({ key: 380, value: values.shortTermLiabilitiesTotal })
    list.push({ key: 391, value: values.equityAtTheBeginningOfTheYear })
    list.push({ key: 392, value: values.revaluationDueToPriceChanges })
    list.push({ key: 393, value: values.reassessmentOther })

    const financialValues: LookupType[] = []
    list.forEach((x) => {
      financialValues.push(lookup(x.key, x.value, financialTypes))
    })

    const clientId = await this.getClientIdByNationalId(client.nationalId)

    const actor = contacts.find((x) => x.contactType === ContactType.Actor)

    const contactsDto = this.convertContacts(contacts)

    const body = {
      star_year: year,
      star_comment: comment,
      'star_Client@odata.bind': `/star_clients(${clientId})`,
      star_representativenationalid: actor?.nationalId,
      star_financialstatementvalue_belongsto_rel: financialValues,
      star_statement_contacts: contactsDto,
      star_email: digitalSignee.email,
      star_phone: digitalSignee.phone,
    }

    const financialStatementId = await this.postFinancialStatement(body)

    if (!financialStatementId) {
      throw new Error('FinancialStatementId can not be null')
    }

    if (file) {
      const fileName = getCemeteryFileName(client.nationalId, year)
      await this.sendFile(financialStatementId, fileName, file)
    }
    return true
  }

  async getConfig(): Promise<Config[]> {
    const select = '$select=star_key,star_value'
    const url = `${this.basePath}/star_configs?${select}`
    const data = await this.getData(url)

    if (!data || !data.value) return []

    const config: Config[] = data.value.map((x: any) => {
      return {
        key: x.star_key,
        value: x.star_value,
      }
    })

    return config
  }

  async getTaxInformationValues(nationalId: string, year: string) {
    const select =
      '$select=star_value&$expand=star_FinancialType($select=star_numeric,star_name)'
    const filter = `$filter=star_TaxInformationEntry/star_year eq ${year} and star_TaxInformationEntry/star_national_id eq '${nationalId}'`
    const url = `${this.basePath}/star_taxinformationvalues?${filter}&${select}`
    const data = await this.getData(url)

    if (!data || !data.value) return []

    const taxInfo: TaxInfo[] = data.value.map((x: any) => {
      return {
        key: x.star_FinancialType.star_numeric,
        value: x.star_value,
      }
    })

    return taxInfo
  }

  async postFinancialStatement(body: any): Promise<string | undefined> {
    try {
      const url = `${this.basePath}/star_financialstatements`
      const res = await this.fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
      })

      const resJson = await res.json()

      const financialStatementId = resJson.star_financialstatementid

      return financialStatementId
    } catch (error) {
      this.logger.info('body', body)
      this.logger.error('Failed to upload financial statement.', error)
    }
  }

  async sendFile(
    financialStatementId: string,
    fileName: string,
    fileContent: string,
  ): Promise<boolean> {
    const buffer = Buffer.from(fileContent, 'base64')

    try {
      const url = `${this.basePath}/star_financialstatements(${financialStatementId})/star_file`
      await this.fetch(url, {
        method: 'PATCH',
        body: buffer,
        headers: {
          'Content-Type': 'application/octet-stream',
          'x-ms-file-name': fileName,
        },
      })
      return true
    } catch (error) {
      this.logger.info('file', fileName, fileContent)
      this.logger.error('Failed to upload financial statement file.', error)
      return false
    }
  }

  private convertContacts(contacts: Contact[]) {
    return contacts.map((x) => {
      const contactDto: ContactDto = {
        star_national_id: x.nationalId,
        star_name: x.name,
        star_contact_type: x.contactType,
      }

      if (x.email) {
        contactDto.star_email = x.email
      }

      if (x.phone) {
        contactDto.star_phone = x.phone
      }

      return contactDto
    })
  }

  async getData(url: string) {
    const response = await this.fetch(url)
    return await response.json()
  }
}
