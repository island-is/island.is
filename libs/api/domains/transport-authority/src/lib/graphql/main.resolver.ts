import { Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { InsuranceCompany } from './models'
import { TransportAuthorityApi } from '../transportAuthority.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly transportAuthorityApi: TransportAuthorityApi) {}

  @Query(() => [InsuranceCompany])
  transportAuthorityInsuranceCompanies() {
    return this.transportAuthorityApi.getInsuranceCompanies()
  }
}
