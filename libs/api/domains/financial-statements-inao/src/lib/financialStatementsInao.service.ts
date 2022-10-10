import { FinancialStatementsInaoClientService } from '@island.is/clients/financial-statements-inao'
import { Injectable } from '@nestjs/common'
import * as kennitala from 'kennitala'
import { InaoCemeteryFinancialStatementInput } from './dto/cemeteryFinancialStatement.input'
import { InaoPoliticalPartyFinancialStatementInput } from './dto/politicalPartyFinancialStatement.input'

interface KeyValue {
  key: number
  value: number
}

@Injectable()
export class FinancialStatementsInaoService {
  constructor(private dataverseClient: FinancialStatementsInaoClientService) {}

  async getClientTypes() {
    return this.dataverseClient.getClientTypes()
  }

  async getUserClientType(nationalId: string) {
    if (kennitala.isPerson(nationalId)) {
      return this.dataverseClient.getClientType('Einstaklingur')
    } else {
      return this.dataverseClient.getUserClientType(nationalId)
    }
  }

  async getElections() {
    return this.dataverseClient.getElections()
  }

  async getClientFinancialLimit(clientType: string, year: string) {
    return this.dataverseClient.getClientFinancialLimit(clientType, year)
  }

  async getConfig() {
    return this.dataverseClient.getConfig()
  }

  async submitPoliticalPartyFinancialStatement(
    nationalId: string,
    actorNationalId: string | undefined,
    input: InaoPoliticalPartyFinancialStatementInput,
  ) {
    const list: KeyValue[] = []
    list.push({ key: 200, value: input.values.contributionsFromTheTreasury })
    list.push({ key: 201, value: input.values.parliamentaryPartySupport })
    list.push({ key: 202, value: input.values.municipalContributions })
    list.push({ key: 203, value: input.values.contributionsFromLegalEntities })
    list.push({ key: 204, value: input.values.contributionsFromIndividuals })
    list.push({ key: 205, value: input.values.generalMembershipFees })
    list.push({ key: 228, value: input.values.capitalIncome })
    list.push({ key: 229, value: input.values.otherIncome })
    list.push({ key: 230, value: input.values.officeOperations })
    list.push({ key: 239, value: input.values.otherOperatingExpenses })
    list.push({ key: 248, value: input.values.financialExpenses })
    list.push({ key: 250, value: input.values.fixedAssetsTotal })
    list.push({ key: 260, value: input.values.currentAssets })
    list.push({ key: 270, value: input.values.longTermLiabilitiesTotal })
    list.push({ key: 280, value: input.values.shortTermLiabilitiesTotal })
    list.push({ key: 290, value: input.values.equityTotal })

    return this.dataverseClient.postFinancialStatementForPoliticalParty(
      nationalId,
      actorNationalId,
      input.year,
      input.comment,
      list,
    )
  }

  async submitCemeteryFinancialStatement(
    nationalId: string,
    actorNationalId: string | undefined,
    input: InaoCemeteryFinancialStatementInput,
  ) {
    const list: KeyValue[] = []
    list.push({ key: 300, value: input.values.careIncome })
    list.push({ key: 301, value: input.values.burialRevenue })
    list.push({ key: 302, value: input.values.grantFromTheCemeteryFund })
    list.push({ key: 328, value: input.values.capitalIncome })
    list.push({ key: 329, value: input.values.otherIncome })
    list.push({ key: 330, value: input.values.salaryAndSalaryRelatedExpenses })
    list.push({ key: 331, value: input.values.funeralExpenses })
    list.push({ key: 332, value: input.values.operationOfAFuneralChapel })
    list.push({ key: 334, value: input.values.donationsToCemeteryFund })
    list.push({ key: 335, value: input.values.contributionsAndGrantsToOthers })
    list.push({ key: 339, value: input.values.otherOperatingExpenses })
    list.push({ key: 348, value: input.values.financialExpenses })
    list.push({ key: 349, value: input.values.depreciation })
    list.push({ key: 350, value: input.values.fixedAssetsTotal })
    list.push({ key: 360, value: input.values.currentAssets })
    list.push({ key: 370, value: input.values.longTermLiabilitiesTotal })
    list.push({ key: 380, value: input.values.shortTermLiabilitiesTotal })
    list.push({ key: 391, value: input.values.equityAtTheBeginningOfTheYear })
    list.push({ key: 392, value: input.values.revaluationDueToPriceChanges })
    list.push({ key: 393, value: input.values.reassessmentOther })

    return this.dataverseClient.postFinancialStatementForCemetery(
      nationalId,
      actorNationalId,
      input.year,
      input.comment,
      list,
    )
  }
}
