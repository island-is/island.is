import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'

import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'

import { Election } from './models/election.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class FinancialStatementsInaoResolver {
  @Query(() => [Election], { nullable: true })
  async getFinancialStatementsInaoElections() {
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
  }
}
