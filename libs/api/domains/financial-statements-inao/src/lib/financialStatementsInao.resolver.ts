import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'

import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'

import { FinancialStatementsInaoService } from './financialStatementsInao.service'
import { Election } from './models/election.model'
import { ClientType } from './models/clientType.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class FinancialStatementsInaoResolver {
  constructor(
    private financialStatementsService: FinancialStatementsInaoService,
  ) {}

  @Query(() => ClientType, { nullable: true })
  async financialStatementsInaoCurrentUserClientType(
    @CurrentUser() user: User,
  ): Promise<ClientType | null> {
    return this.financialStatementsService.getUserClientType(user.nationalId)

    // return {
    //   code: 'individual', //individual, party, cemetery
    //   name: 'Einstaklingur', //Einstaklingur, Stjórnmálasamtök, Kirkjugarður
    // }
  }

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
