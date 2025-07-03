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
import { Name } from '../../../../national-registry/src/lib/shared/models/name.model' 
import { NationalRegistryService } from '@island.is/api/domains/national-registry'

@Resolver(() => Name)
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class NationalRegistryResolver {
  constructor(private readonly service: NationalRegistryService) {}

  @Query(() => Name, {
    name: 'formSystemNameByNationalId',
  })
  async getName(
    @Args('input', { type: () => String }) input: string,
  ): Promise<Name | null> {
    return await this.service.getName(input)
  }
}
