import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { CodeOwners } from '@island.is/shared/constants'
import type { Locale } from '@island.is/shared/types'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { CodeOwner } from '@island.is/nest/core'
import { MyPagesApplicationService } from './myPagesApplication.service'
import { MyPagesApplication } from './myPagesApplication.model'
import {
  ApplicationApplicationsInput,
  Application,
} from '@island.is/api/domains/application'

@UseGuards(IdsUserGuard, ScopesGuard)
@CodeOwner(CodeOwners.NordaApplications)
// TODO: add Advania
@Resolver(() => MyPagesApplication)
export class MyPagesApplicationResolver {
  constructor(
    private readonly myPagesApplicationService: MyPagesApplicationService,
  ) {}

  @Query(() => [MyPagesApplication], {
    nullable: true,
    name: 'myPagesApplications',
  })
  async myPagesApplications(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input', { nullable: true }) input?: ApplicationApplicationsInput,
  ): Promise<MyPagesApplication[] | null> {
    return this.myPagesApplicationService.combinedApplications(
      user,
      locale,
      input,
    )
  }

  //   @Mutation(() => MyPagesApplication, { nullable: true })
  //   async deleteApplication(
  //     @Args('input') input: DeleteApplicationInput,
  //     @CurrentUser() user: User,
  //   ): Promise<void> {
  //     return this.myPagesService.deleteApplication(input, user)
  //   }
}
