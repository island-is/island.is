import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import { Context, Query } from '@nestjs/graphql'
import { PersonalTaxReturnResponse, DirectTaxPaymentsResponse } from './models/'
import BackendAPI from '../../../services/backend'

@UseGuards(IdsUserGuard)
@Audit({ namespace: '@island.is/api/personal-tax-return' })
export class PersonalTaxReturnResolver {
  @Query(() => PersonalTaxReturnResponse)
  async municipalitiesPersonalTaxReturn(
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<PersonalTaxReturnResponse> {
    return await backendApi.getPersonalTaxReturn()
  }

  @Query(() => DirectTaxPaymentsResponse)
  async municipalitiesDirectTaxPayments(
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<DirectTaxPaymentsResponse> {
    return await backendApi.getDirectTaxPayments()
  }
}
