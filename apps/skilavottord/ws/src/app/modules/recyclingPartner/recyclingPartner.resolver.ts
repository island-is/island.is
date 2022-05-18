import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ConflictException, NotFoundException } from '@nestjs/common'

import { Authorize, Role } from '../auth'

import { RecyclingPartnerModel } from './recyclingPartner.model'
import { RecyclingPartnerService } from './recyclingPartner.service'
import {
  CreateRecyclingPartnerInput,
  RecyclingPartnerInput,
  UpdateRecyclingPartnerInput,
} from './recyclingPartner.input'

@Authorize()
@Resolver(() => RecyclingPartnerModel)
export class RecyclingPartnerResolver {
  constructor(private recyclingPartnerService: RecyclingPartnerService) {}

  @Authorize({
    roles: [Role.developer, Role.recyclingFund],
  })
  @Query(() => [RecyclingPartnerModel])
  async skilavottordAllRecyclingPartners(): Promise<RecyclingPartnerModel[]> {
    return this.recyclingPartnerService.findAll()
  }

  @Query(() => [RecyclingPartnerModel])
  async skilavottordAllActiveRecyclingPartners(): Promise<
    RecyclingPartnerModel[]
  > {
    return this.recyclingPartnerService.findAllActive()
  }

  @Authorize({
    roles: [Role.developer, Role.recyclingFund],
  })
  @Query(() => RecyclingPartnerModel)
  async skilavottordRecyclingPartner(
    @Args('input', { type: () => RecyclingPartnerInput })
    { companyId }: RecyclingPartnerInput,
  ): Promise<RecyclingPartnerModel> {
    return this.recyclingPartnerService.findOne(companyId)
  }

  @Authorize({
    roles: [Role.developer, Role.recyclingFund],
  })
  @Mutation(() => RecyclingPartnerModel)
  async createSkilavottordRecyclingPartner(
    @Args('input', { type: () => CreateRecyclingPartnerInput })
    input: CreateRecyclingPartnerInput,
  ) {
    const recyclingPartner = await this.recyclingPartnerService.findOne(
      input.companyId,
    )

    if (recyclingPartner) {
      throw new ConflictException(
        'Recycling partner with that id already exists',
      )
    }

    return this.recyclingPartnerService.create(input)
  }

  @Authorize({
    roles: [Role.developer, Role.recyclingFund],
  })
  @Mutation(() => RecyclingPartnerModel)
  async updateSkilavottordRecyclingPartner(
    @Args('input', { type: () => UpdateRecyclingPartnerInput })
    input: UpdateRecyclingPartnerInput,
  ) {
    const recyclingPartner = await this.recyclingPartnerService.findOne(
      input.companyId,
    )
    if (!recyclingPartner) {
      throw new NotFoundException("Recycling partner doesn't exists")
    }
    return this.recyclingPartnerService.update(input)
  }
}
