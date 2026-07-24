import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import { Args, Context, Query } from '@nestjs/graphql'
import { PersonalTaxReturnResponse, DirectTaxPaymentsResponse } from './models/'
import BackendAPI from '../../../services/backend'
import { MunicipalitiesPersonalTaxReturnIdInput } from './dto/municipalitiesPersonalTaxReturn.input'

@UseGuards(IdsUserGuard)
@Audit({ namespace: '@island.is/api/personal-tax-return' })
export class PersonalTaxReturnResolver {
  @Query(() => PersonalTaxReturnResponse)
  async municipalitiesPersonalTaxReturn(
    @Args('input', { type: () => MunicipalitiesPersonalTaxReturnIdInput })
    input: MunicipalitiesPersonalTaxReturnIdInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<PersonalTaxReturnResponse> {
    return await backendApi.getPersonalTaxReturn(input.id)
  }

  @Query(() => DirectTaxPaymentsResponse)
  async municipalitiesDirectTaxPayments(
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<DirectTaxPaymentsResponse> {
    return await backendApi.getDirectTaxPayments()
  }
}
