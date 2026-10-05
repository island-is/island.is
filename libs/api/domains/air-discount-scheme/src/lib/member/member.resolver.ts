import { UseGuards } from '@nestjs/common'
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { CodeOwner } from '@island.is/nest/core'
import { Loader } from '@island.is/nest/dataloader'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { CodeOwners } from '@island.is/shared/constants'

import { Benefit } from '../models/benefit.model'
import { Member } from '../models/member.model'
import { UsedFlightLeg } from '../models/usedFlightLeg.model'
import { isServiceDisabled } from '../shared/isServiceDisabled'
import { MemberService } from './member.service'
import type { UsedFlightLegsDataLoader } from './usedFlightLegs.loader'
import { UsedFlightLegsLoader } from './usedFlightLegs.loader'

@CodeOwner(CodeOwners.Hugsmidjan)
@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Audit({ namespace: '@island.is/air-discount-scheme' })
@Resolver(() => Member)
export class MemberResolver {
  constructor(
    private readonly memberService: MemberService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  @Query(() => [Member], { name: 'airDiscountSchemeMembers' })
  @Audit()
  async members(@CurrentUser() user: User): Promise<Member[]> {
    if (await isServiceDisabled(this.featureFlagService, user)) {
      return []
    }
    return this.memberService.getMembers(user)
  }

  @ResolveField('benefit', () => Benefit, { nullable: true })
  benefit(
    @Parent() member: Member,
    @CurrentUser() user: User,
  ): Promise<Benefit | null> {
    return this.memberService.getBenefit(user, member.nationalId)
  }

  @ResolveField('usedFlightLegsThisPeriod', () => [UsedFlightLeg])
  usedFlightLegsThisPeriod(
    @Parent() member: Member,
    @Loader(UsedFlightLegsLoader) loader: UsedFlightLegsDataLoader,
  ): Promise<UsedFlightLeg[]> {
    return loader.load(member.nationalId)
  }
}
