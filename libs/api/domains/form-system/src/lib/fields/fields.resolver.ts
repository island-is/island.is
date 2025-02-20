import { UseGuards } from '@nestjs/common'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { FieldsService } from './fields.service'
import {
  CreateFieldInput,
  DeleteFieldInput,
  FieldDto,
  UpdateFieldInput,
  UpdateFieldsDisplayOrderDto,
} from '@island.is/form-system-dto'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
@Audit({ namespace: '@island.is/api/form-system' })
export class FieldsResolver {
  constructor(private readonly fieldsService: FieldsService) {}

  @Mutation(() => FieldDto, {
    name: 'formSystemCreateField',
  })
  async createField(
    @Args('input', { type: () => CreateFieldInput }) input: CreateFieldInput,
    @CurrentUser() user: User,
  ): Promise<FieldDto> {
    return this.fieldsService.createField(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemUpdateField',
    nullable: true,
  })
  async updateField(
    @Args('input', { type: () => UpdateFieldInput }) input: UpdateFieldInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.fieldsService.updateField(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemDeleteField',
    nullable: true,
  })
  async deleteField(
    @Args('input', { type: () => DeleteFieldInput }) input: DeleteFieldInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.fieldsService.deleteField(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemUpdateFieldsDisplayOrder',
    nullable: true,
  })
  async updateFieldsDisplayOrder(
    @Args('input', { type: () => UpdateFieldsDisplayOrderDto })
    input: UpdateFieldsDisplayOrderDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.fieldsService.updateFieldsDisplayOrder(user, input)
  }
}
