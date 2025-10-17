import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import {
  FriggClientService,
  KeyOption,
  OrganizationModel,
} from '@island.is/clients/mms/frigg'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { KeyOptionModel } from './frigg/keyOption.model'
import { FriggOptionListInput } from './frigg/optionList.input'
import { FriggOrganizationInput } from './frigg/organization.input'
import { FriggOrganization } from './frigg/organization.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class FriggResolver {
  constructor(private readonly friggClientService: FriggClientService) {}

  @Query(() => [KeyOptionModel], { nullable: true })
  friggOptions(
    @CurrentUser() user: User,
    @Args('input', { type: () => FriggOptionListInput })
    input: FriggOptionListInput,
  ): Promise<KeyOption[]> {
    return this.friggClientService.getAllKeyOptions(user, input.type)
  }

  @Query(() => [FriggOrganization], { nullable: true })
  friggOrganizationsByType(
    @CurrentUser() user: User,
    @Args('input', { type: () => FriggOrganizationInput, nullable: true })
    input?: FriggOrganizationInput,
  ): Promise<OrganizationModel[]> {
    return this.friggClientService.getOrganizationsByType(user, input)
  }
}
