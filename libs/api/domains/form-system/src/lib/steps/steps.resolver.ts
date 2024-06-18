import { Query, Args, Resolver, Mutation } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import {
  CreateStepInput,
  DeleteStepInput,
  GetStepInput,
  UpdateStepInput,
} from '../../dto/steps.input'
import { Step } from '../../models/step.model'
import { StepsService } from './steps.service'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'

@Resolver()
@UseGuards(IdsUserGuard)
@Audit({ namespace: '@island.is/api/form-system' })
export class StepsResolver {
  constructor(private readonly stepsService: StepsService) {}

  @Query(() => Step, {
    name: 'formSystemGetStep',
  })
  async getStep(
    @Args('input', { type: () => GetStepInput }) input: GetStepInput,
    @CurrentUser() user: User,
  ): Promise<Step> {
    return this.stepsService.getStep(user, input)
  }

  @Mutation(() => Step, {
    name: 'formSystemCreateStep',
  })
  async postStep(
    @Args('input', { type: () => CreateStepInput }) input: CreateStepInput,
    @CurrentUser() user: User,
  ): Promise<Step> {
    return this.stepsService.postStep(user, input)
  }

  @Mutation(() => Boolean, {
    nullable: true,
    name: 'formSystemDeleteStep',
  })
  async deleteStep(
    @Args('input', { type: () => DeleteStepInput }) input: DeleteStepInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return await this.stepsService.deleteStep(user, input)
  }

  @Mutation(() => Boolean, {
    nullable: true,
    name: 'formSystemUpdateStep',
  })
  async updateStep(
    @Args('input', { type: () => UpdateStepInput }) input: UpdateStepInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.stepsService.updateStep(user, input)
  }
}
