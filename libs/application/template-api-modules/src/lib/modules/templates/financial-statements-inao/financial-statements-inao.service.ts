import { Injectable } from '@nestjs/common'
import { FinancialStatementsInaoClientService } from '@island.is/clients/financial-statements-inao'
import * as kennitala from 'kennitala'
import { TemplateApiModuleActionProps } from '../../../types'
import { getValueViaPath } from '@island.is/application/core'

const LESS = 'less'

export interface DataResponse {
  success: boolean
  message?: string
}
@Injectable()
export class FinancialStatementsInaoTemplateService {
  constructor(
    private financialStatementsClientService: FinancialStatementsInaoClientService,
  ) {}

  async getUserType({ auth }: TemplateApiModuleActionProps) {
    const { nationalId } = auth

    if (kennitala.isPerson(nationalId)) {
      return this.financialStatementsClientService.getClientType(
        'Einstaklingur',
      )
    } else {
      return this.financialStatementsClientService.getUserClientType(nationalId)
    }
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { nationalId } = auth
    const answers = application.answers

    const values = {
      contributionsByLegalEntities: Number(
        getValueViaPath(
          answers,
          'individualIncome.contributionsByLegalEntities',
        ),
      ),
      candidatesOwnContributions: Number(
        getValueViaPath(answers, 'individualIncome.candidatesOwnContributions'),
      ),
      individualContributions: Number(
        getValueViaPath(answers, 'individualIncome.individualContributions'),
      ),
      otherIncome: Number(
        getValueViaPath(answers, 'individualIncome.otherIncome'),
      ),
      electionOfficeExpenses: Number(
        getValueViaPath(answers, 'individualExpense.electionOffice'),
      ),
      advertisingAndPromotions: Number(
        getValueViaPath(answers, 'individualExpense.advertisements'),
      ),
      meetingsAndTravelExpenses: Number(
        getValueViaPath(answers, 'individualExpense.travelCost'),
      ),
      otherExpenses: Number(
        getValueViaPath(answers, 'individualExpense.otherCost'),
      ),
      capitalIncome: Number(
        getValueViaPath(answers, 'capitalNumbers.capitalIncome'),
      ),
      financialExpenses: Number(
        getValueViaPath(answers, 'capitalNumbers.capitalCost'),
      ),
      fixedAssetsTotal: Number(
        getValueViaPath(answers, 'asset.fixedAssetsTotal'),
      ),
      currentAssets: Number(getValueViaPath(answers, 'asset.tangible')),
      longTermLiabilitiesTotal: Number(
        getValueViaPath(answers, 'liability.longTerm'),
      ),
      shortTermLiabilitiesTotal: Number(
        getValueViaPath(answers, 'liability.shortTerm'),
      ),
      equityTotal: Number(getValueViaPath(answers, 'equity.totalEquity')),
    }

    const electionId = getValueViaPath(
      answers,
      'election.selectElection',
    ) as string
    const clientName = getValueViaPath(answers, 'about.fullName') as string
    const electionIncomeLimit = getValueViaPath(
      answers,
      'election.incomeLimit',
    ) as string
    const noValueStatement = electionIncomeLimit === LESS ? true : false

    // clientNationalId: string,
    // actorNationalId: string | undefined,
    // electionId: string,
    // noValueStatement: boolean,
    // clientName: string,

    // actor is undefined until we add the functionality to the frontend
    const result: DataResponse = await this.financialStatementsClientService
      .postFinancialStatementForPersonalElection(
        nationalId,
        undefined,
        electionId,
        noValueStatement,
        clientName,
        values,
      )
      .then(() => {
        return { success: true }
      })
      .catch((e) => {
        return {
          success: false,
          errorMessage: e.message,
        }
      })
    console.log('dataverse', result)
    if (!result.success) {
      throw new Error(`Application submission failed`)
    }
    return { success: result.success }
  }
}
