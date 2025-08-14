import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { FormSystemNameByNationalId } from '../../models/nationalRegistryName.model'
import { FormSystemHomeByNationalId } from '../../models/nationalRegistryHome.model'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class NationalRegistryResolver {
  constructor(private readonly service: NationalRegistryV3ClientService) {}

  @Query(() => FormSystemNameByNationalId, {
    name: 'formSystemNameByNationalId',
    nullable: true,
  })
  async getName(
    @Args('input', { type: () => String }) input: string,
  ): Promise<FormSystemNameByNationalId | null> {
    return this.service.getName(input)
  }

  @Query(() => FormSystemHomeByNationalId, {
    name: 'formSystemHomeByNationalId',
    nullable: true,
  })
  async getAddress(
    @Args('input', { type: () => String }) input: string,
  ): Promise<FormSystemHomeByNationalId | null> {
    return this.service.getHousing(input)
  }
}
