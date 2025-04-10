import { UseGuards } from '@nestjs/common'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { ApplicantsService } from './applicants.service'
import { Applicant } from '../../models/applicant.model'
import {
  CreateApplicantInput,
  DeleteApplicantInput,
  UpdateApplicantInput,
} from '../../dto/applicant.input'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class ApplicantsResolver {
  constructor(private readonly applicantsService: ApplicantsService) {}

  @Mutation(() => Applicant, {
    name: 'createFormSystemApplicant',
  })
  async createApplicant(
    @Args('input') input: CreateApplicantInput,
    @CurrentUser() user: User,
  ): Promise<Applicant> {
    return this.applicantsService.createApplicant(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'deleteFormSystemApplicant',
    nullable: true,
  })
  async deleteApplicant(
    @Args('input') input: DeleteApplicantInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.applicantsService.deleteApplicant(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'updateFormSystemApplicant',
    nullable: true,
  })
  async updateApplicant(
    @Args('input') input: UpdateApplicantInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.applicantsService.updateApplicant(user, input)
  }
}
