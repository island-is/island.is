import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Authorize, Role } from '../auth'

import { RecyclingPartnerModel } from './recyclingPartner.model'
import { RecyclingPartnerService } from './recyclingPartner.service'
import {
  CreateRecyclingPartnerInput,
  DeleteRecyclingPartnerInput,
  RecyclingPartnerInput,
  UpdateRecyclingPartnerInput,
} from './recyclingPartner.input'

@Authorize({
  throwOnUnAuthorized: false,
  roles: [Role.developer, Role.recyclingCompany],
})
@Resolver(() => RecyclingPartnerModel)
export class RecyclingPartnerResolver {
  constructor(private recyclingPartnerService: RecyclingPartnerService) {}

  @Query(() => [RecyclingPartnerModel])
  async skilavottordAllRecyclingPartners(): Promise<RecyclingPartnerModel[]> {
    return await this.recyclingPartnerService.findAll()
  }

  @Query(() => [RecyclingPartnerModel])
  async skilavottordAllActiveRecyclingPartners(): Promise<
    RecyclingPartnerModel[]
  > {
    return this.recyclingPartnerService.findAllActive()
  }

  @Query(() => RecyclingPartnerModel)
  async skilavottordRecyclingPartner(
    @Args('input', { type: () => RecyclingPartnerInput })
    { companyId }: RecyclingPartnerInput,
  ): Promise<RecyclingPartnerModel> {
    return this.recyclingPartnerService.findOne(companyId)
  }

  @Mutation(() => RecyclingPartnerModel)
  async createSkilavottordRecyclingPartner(
    @Args('input', { type: () => CreateRecyclingPartnerInput })
    input: CreateRecyclingPartnerInput,
  ) {
    return this.recyclingPartnerService.createRecyclingPartner(input)
  }

  @Mutation(() => RecyclingPartnerModel)
  async updateSkilavottordRecyclingPartner(
    @Args('input', { type: () => UpdateRecyclingPartnerInput })
    input: UpdateRecyclingPartnerInput,
  ) {
    return this.recyclingPartnerService.updateRecyclingPartner(input)
  }

  @Mutation(() => Boolean)
  async deleteSkilavottordRecyclingPartner(
    @Args('input', { type: () => DeleteRecyclingPartnerInput })
    input: DeleteRecyclingPartnerInput,
  ) {
    return this.recyclingPartnerService.deleteRecyclingPartner(input)
  }
}
