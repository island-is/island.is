import { UseGuards } from '@nestjs/common'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { FormDelegationUpdateInput } from '../../dto/formDelegation.input'
import { FormDelegationsService } from './formDelegations.service'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class FormDelegationsResolver {
  constructor(
    private readonly formDelegationsService: FormDelegationsService,
  ) {}

  @Mutation(() => Boolean, {
    name: 'createFormSystemFormDelegation',
  })
  async createFormDelegation(
    @Args('input', { type: () => FormDelegationUpdateInput })
    input: FormDelegationUpdateInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.formDelegationsService.createFormDelegation(user, input)
    return true
  }

  @Mutation(() => Boolean, {
    name: 'deleteFormSystemFormDelegation',
    nullable: true,
  })
  async deleteFormDelegation(
    @Args('input', { type: () => FormDelegationUpdateInput })
    input: FormDelegationUpdateInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.formDelegationsService.deleteFormDelegation(user, input)
    return true
  }
}
