import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { FetchError } from '@island.is/clients/middlewares'
import { FriggKeyInfoClientService } from '@island.is/clients/mms/frigg'

import { OwnContact } from '../models/ownContact.model'
import { UpdateOwnContactInput } from '../dto/ownContact.input'
import { ProblemError } from '@island.is/nest/problem'
import {
  toMmsKeyInfoProblem,
  withMmsKeyInfoProblem,
  type MmsKeyInfoProblem,
} from '../errors/mmsKeyInfoProblem'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.isServicePortalPrimarySchoolKeyInfoEnabled)
@Scopes(ApiScope.education)
@Resolver()
export class EducationOwnContactResolver {
  constructor(private readonly keyInfoClient: FriggKeyInfoClientService) {}

  @Query(() => OwnContact, {
    nullable: true,
    description:
      'The signed-in user’s own email and phone as recorded in MMS. Null when the user is not a guardian or emergency contact of a child with an enrollment in effect.',
  })
  async educationOwnContact(
    @CurrentUser() user: User,
  ): Promise<OwnContact | null> {
    try {
      return await this.keyInfoClient.getOwnContact(user)
    } catch (error) {
      if (error instanceof FetchError && error.status === 404) {
        return null
      }
      const problem = toMmsKeyInfoProblem(error)
      if (
        problem instanceof ProblemError &&
        NOTHING_TO_SHOW_CODES.includes(
          (problem.problem as Partial<MmsKeyInfoProblem>).mmsCode ?? '',
        )
      ) {
        return null
      }
      throw problem
    }
  }

  @Mutation(() => OwnContact)
  async educationUpdateOwnContact(
    @CurrentUser() user: User,
    @Args('input') input: UpdateOwnContactInput,
  ): Promise<OwnContact> {
    return withMmsKeyInfoProblem(
      () =>
        this.keyInfoClient.updateOwnContact(user, {
          email: input.email ?? null,
          phone: input.phone ?? null,
        }),
      { fields: ['email', 'phone'] },
    )
  }
}

/** Contract v0.4 §4.2: the caller is not in nemendagrunnur, or is acting on
 * someone's behalf. Neither has an own contact to show. */
const NOTHING_TO_SHOW_CODES = ['NOT_A_GUARDIAN', 'DELEGATION_NOT_SUPPORTED']
