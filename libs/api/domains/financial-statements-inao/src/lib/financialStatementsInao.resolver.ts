import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'

import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'

import { Election } from './models/election.model'
import { FinancialStatementsInaoService } from './financialStatementsInao.service'
import { ClientType } from './models/clientType.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class FinancialStatementsInaoResolver {
  constructor(
    private financialStatementsService: FinancialStatementsInaoService,
  ) {}

  @Query(() => [Election], { nullable: true })
  async financialStatementsInaoElections() {
    //Return mocked results while the cloud service is not ready
    return [
      {
        name: 'Forsetakosningar 2020',
        year: 2020,
        month: 6,
        ageLimit: 35,
      },
      {
        name: 'Alþingiskosningar 2021',
        year: 2021,
        month: 9,
      },
    ]

    //return this.financialStatementsService.getElections()
  }

  @Query(() => [ClientType], { nullable: true })
  async financialStatementsInaoClientTypes() {
    return this.financialStatementsService.getClientTypes()
  }
}
