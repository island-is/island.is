import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import { Args, Query } from '@nestjs/graphql'
import { PersonalTaxReturnResponse, DirectTaxPaymentsResponse } from './models/'
import BackendAPI from '../../../services/backend'
import { MunicipalitiesPersonalTaxReturnIdInput } from './dto/municipalitiesPersonalTaxReturn.input'

@UseGuards(IdsUserGuard)
@Audit({ namespace: '@island.is/api/personal-tax-return' })
export class PersonalTaxReturnResolver {
  constructor(private readonly backendApi: BackendAPI) {}

  @Query(() => PersonalTaxReturnResponse)
  async municipalitiesPersonalTaxReturn(
    @Args('input', { type: () => MunicipalitiesPersonalTaxReturnIdInput })
    input: MunicipalitiesPersonalTaxReturnIdInput,
  ): Promise<PersonalTaxReturnResponse> {
    return await this.backendApi.getPersonalTaxReturn(input.id)
  }

  @Query(() => DirectTaxPaymentsResponse)
  async municipalitiesDirectTaxPayments(): Promise<DirectTaxPaymentsResponse> {
    return await this.backendApi.getDirectTaxPayments()
  }
}
