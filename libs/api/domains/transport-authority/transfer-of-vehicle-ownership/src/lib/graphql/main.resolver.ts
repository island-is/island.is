import { Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { InsuranceCompany } from './models'
import { TransferOfVehicleOwnershipApi } from '../transferOfVehicleOwnership.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class MainResolver {
  constructor(
    private readonly transferOfVehicleOwnershipApi: TransferOfVehicleOwnershipApi,
  ) {}

  @Query(() => [InsuranceCompany])
  transportAuthorityInsuranceCompanies() {
    return this.transferOfVehicleOwnershipApi.getInsuranceCompanies()
  }
}
