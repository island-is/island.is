import { Args, Query, Resolver } from '@nestjs/graphql'

import { UseGuards } from '@nestjs/common'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'

import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { FriggClientService, KeyOption } from '@island.is/clients/mms/frigg'

import { KeyOptionModel } from './frigg/keyOption.model'
import { FriggOptionListInput } from './frigg/optionList.input'

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
  /* SMALL TEST */
}
