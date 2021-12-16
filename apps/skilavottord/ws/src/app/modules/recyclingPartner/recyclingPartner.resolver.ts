import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards, ConflictException, NotFoundException } from '@nestjs/common'

import { IdsUserGuard } from '@island.is/auth-nest-tools'

import { RecyclingPartnerModel } from './recyclingPartner.model'
import { RecyclingPartnerService } from './recyclingPartner.service'
import {
  CreateRecyclingPartnerInput,
  RecyclingPartnerInput,
  UpdateRecyclingPartnerInput,
} from './recyclingPartner.input'

// @Authorize({ throwOnUnAuthorized: false, roles: [Role.developer, Role.recyclingCompany] })
@UseGuards(IdsUserGuard)
@Resolver(() => RecyclingPartnerModel)
export class RecyclingPartnerResolver {
  constructor(private recyclingPartnerService: RecyclingPartnerService) {}

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
