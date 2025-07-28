import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { UseGuards } from '@nestjs/common'
import {
  Args,
  Query,
  Resolver,
} from '@nestjs/graphql'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { formSystemNameByNationalId } from '../../models/nationalRegistryName.model'
import { formSystemHomeByNationalId } from '../../models/nationalRegistryHome.model'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class NationalRegistryResolver {
  constructor(private readonly service: NationalRegistryV3ClientService) {}

  @Query(() => formSystemNameByNationalId, {
    name: 'formSystemNameByNationalId',
  })
  async getName(
    @Args('input', { type: () => String }) input: string,
  ): Promise<formSystemNameByNationalId | null> {
    return this.service.getName(input)
  }

  @Query(() => formSystemHomeByNationalId, {
    name: 'formSystemHomeByNationalId',
  })
  async getAddress(
    @Args('input', { type: () => String }) input: string,
  ): Promise<formSystemHomeByNationalId | null> {
    return this.service.getHousing(input)
  }
}
