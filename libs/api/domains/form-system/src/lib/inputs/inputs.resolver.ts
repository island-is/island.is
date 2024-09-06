import { Query, Args, Resolver, Mutation } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import {
  GetInputInput,
  CreateInputInput,
  DeleteInputInput,
  UpdateInputInput,
} from '../../dto/inputs.input'
import { Input } from '../../models/input.model'
import { InputsService } from './inputs.service'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'

@Resolver()
@UseGuards(IdsUserGuard)
@Audit({ namespace: '@island.is/api/form-system' })
export class InputsResolver {
  constructor(private readonly inputsService: InputsService) {}

  @Query(() => Input, {
    name: 'formSystemGetInput',
  })
  async getInput(
    @Args('input', { type: () => GetInputInput }) input: GetInputInput,
    @CurrentUser() user: User,
  ): Promise<Input> {
    return this.inputsService.getInput(user, input)
  }

  @Mutation(() => Input, {
    name: 'formSystemCreateInput',
  })
  async postInput(
    @Args('input', { type: () => CreateInputInput }) input: CreateInputInput,
    @CurrentUser() user: User,
  ): Promise<Input> {
    return this.inputsService.postInput(user, input)
  }

  @Mutation(() => Boolean, {
    nullable: true,
    name: 'formSystemDeleteInput',
  })
  async deleteInput(
    @Args('input', { type: () => DeleteInputInput }) input: DeleteInputInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    const response = await this.inputsService.deleteInput(user, input)
    return response
  }

  @Mutation(() => Boolean, {
    nullable: true,
    name: 'formSystemUpdateInput',
  })
  async updateInput(
    @Args('input', { type: () => UpdateInputInput }) input: UpdateInputInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.inputsService.updateInput(user, input)
  }
}
