import { Query, Args, Resolver, Mutation } from "@nestjs/graphql";
import { CurrentUser, type User } from '@island.is/auth-nest-tools'
import { CreateStepInput, DeleteStepInput, GetStepInput, UpdateStepInput } from "../../dto/steps.input";
import { Step } from "../../models/step.model";
import { StepsService } from "./steps.service";
import { Audit } from '@island.is/nest/audit'


@Resolver()
@Audit({ namespace: '@island.is/api/form-system' })
export class StepsResolver {
  constructor(private readonly stepsService: StepsService) { }

  @Query(() => Step, {
    name: 'formSystemGetStep'
  })
  async getStep(
    @Args('input', { type: () => GetStepInput }) input: GetStepInput,
    @CurrentUser() user: User
  ): Promise<Step> {
    return this.stepsService.getStep(user, input)
  }

  @Mutation(() => Step, {
    name: 'formSystemCreateStep'
  })
  async postStep(
    @Args('input', { type: () => CreateStepInput }) input: CreateStepInput,
    @CurrentUser() user: User
  ): Promise<Step> {
    return this.stepsService.postStep(user, input)
  }

  @Mutation(() => Step, {
    name: 'formSystemDeleteStep'
  })
  async deleteStep(
    @Args('input', { type: () => DeleteStepInput }) input: DeleteStepInput,
    @CurrentUser() user: User
  ): Promise<void> {
    return this.stepsService.deleteStep(user, input)
  }

  @Mutation(() => Step, {
    name: 'formSystemUpdateStep'
  })
  async updateStep(
    @Args('input', { type: () => UpdateStepInput }) input: UpdateStepInput,
    @CurrentUser() user: User
  ): Promise<Step> {
    return this.stepsService.updateStep(user, input)
  }
}
