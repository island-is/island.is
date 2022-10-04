import { Injectable } from '@nestjs/common'
import { FinancialStatementsInaoClientService } from '@island.is/clients/financial-statements-inao'
import { FinancialStatementsInaoService } from '@island.is/api/domains/financial-statements-inao'
import * as kennitala from 'kennitala'
import { TemplateApiModuleActionProps } from '../../../types'
import { getValueViaPath } from '@island.is/application/core'
@Injectable()
export class FinancialStatementsInaoTemplateService {
  constructor(
    private financialStatementsClientService: FinancialStatementsInaoClientService,
    private financialStatementsInaoService: FinancialStatementsInaoService,
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
    const noValueStatement = false

    return this.financialStatementsInaoService.submitPersonalElectionFinancialStatement(
      nationalId,
      undefined,
      { electionId, clientName, noValueStatement, values },
    )
  }
}
