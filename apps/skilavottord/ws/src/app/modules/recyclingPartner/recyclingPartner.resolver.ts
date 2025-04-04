import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Authorize, Role } from '../auth'

import {
  CreateRecyclingPartnerInput,
  RecyclingPartnerInput,
  UpdateRecyclingPartnerInput,
} from './recyclingPartner.input'
import { RecyclingPartnerModel } from './recyclingPartner.model'
import { RecyclingPartnerService } from './recyclingPartner.service'

@Authorize()
@Resolver(() => RecyclingPartnerModel)
export class RecyclingPartnerResolver {
  constructor(private recyclingPartnerService: RecyclingPartnerService) {}

  @Authorize({
    roles: [Role.developer, Role.recyclingFund, Role.municipality],
  })
  @Query(() => [RecyclingPartnerModel], {
    name: 'skilavottordAllRecyclingPartners',
  })
  async getAllRecyclingPartners(): Promise<RecyclingPartnerModel[]> {
    return this.recyclingPartnerService.findAll()
  }

  @Authorize({
    roles: [Role.developer, Role.recyclingFund, Role.municipality],
  })
  @Query(() => [RecyclingPartnerModel], {
    name: 'skilavottordRecyclingPartners',
  })
  async skilavottordRecyclingPartners(
    @Args('isMunicipalityPage', { type: () => Boolean, nullable: true })
    isMunicipalityPage: boolean,
    @Args('municipalityId', { type: () => String, nullable: true })
    municipalityId: string | null,
  ): Promise<RecyclingPartnerModel[]> {
    try {
      return this.recyclingPartnerService.findRecyclingPartners(
        isMunicipalityPage,
        municipalityId,
      )
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch recycling partners: ${error.message}`,
      )
    }
  }

  @Query(() => [RecyclingPartnerModel])
  async skilavottordAllActiveRecyclingPartners(): Promise<
    RecyclingPartnerModel[]
  > {
    return this.recyclingPartnerService.findAllActive()
  }

  @Authorize({
    roles: [Role.developer, Role.recyclingFund, Role.municipality],
  })
  @Query(() => RecyclingPartnerModel)
  async skilavottordRecyclingPartner(
    @Args('input', { type: () => RecyclingPartnerInput })
    { companyId }: RecyclingPartnerInput,
  ): Promise<RecyclingPartnerModel> {
    return this.recyclingPartnerService.findOne(companyId)
  }

  @Authorize({
    roles: [Role.developer, Role.recyclingFund, Role.municipality],
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
        `Recycling partner with the id ${input.companyId} already exists`,
      )
    }

    return this.recyclingPartnerService.create(input)
  }

  @Authorize({
    roles: [Role.developer, Role.recyclingFund, Role.municipality],
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

  @Authorize({
    roles: [
      Role.developer,
      Role.recyclingFund,
      Role.municipality,
      Role.recyclingCompany,
      Role.recyclingCompanyAdmin,
    ],
  })
  @Query(() => Boolean)
  async skilavottordRecyclingPartnerActive(
    @Args('input', { type: () => RecyclingPartnerInput })
    input: RecyclingPartnerInput,
  ) {
    return this.recyclingPartnerService.isRecyclingPartnerActive(
      input.companyId,
    )
  }
}
