import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { ApplicantsService } from './applicants.service'
import { Applicant } from '../../models/applicant.model'
import { CreateApplicantInput, DeleteApplicantInput, UpdateApplicantInput } from '../../dto/applicant.input'


@Resolver()
@UseGuards(IdsUserGuard)
@Audit({ namespace: '@island.is/api/form-system' })
export class ApplicantsResolver {
  constructor(private readonly applicantsService: ApplicantsService) { }

  @Mutation(() => Applicant, {
    name: 'formSystemCreateApplicant',
  })
  async createApplicant(
    @Args('input') input: CreateApplicantInput,
    @CurrentUser() user: User,
  ): Promise<Applicant> {
    return this.applicantsService.createApplicant(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemDeleteApplicant',
    nullable: true
  })
  async deleteApplicant(
    @Args('input') input: DeleteApplicantInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.applicantsService.deleteApplicant(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemUpdateApplicant',
    nullable: true
  })
  async updateApplicant(
    @Args('input') input: UpdateApplicantInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.applicantsService.updateApplicant(user, input)
  }
}
