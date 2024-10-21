import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import {
  CreateFieldInput,
  UpdateFieldInput,
  DeleteFieldInput,
  UpdateFieldsDisplayOrderInput,
} from '../../dto/field.input'
import { FieldsService } from './fields.service'
import { Field } from '../../models/field.model'

@Resolver()
@UseGuards(IdsUserGuard)
@Audit({ namespace: '@island.is/api/form-system' })
export class FieldsResolver {
  constructor(private readonly fieldsService: FieldsService) { }

  @Mutation(() => Field, {
    name: 'formSystemCreateField',
  })
  async createField(
    @Args('input', { type: () => CreateFieldInput }) input: CreateFieldInput,
    @CurrentUser() user: User,
  ): Promise<Field> {
    return this.fieldsService.createField(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemUpdateField',
    nullable: true
  })
  async updateField(
    @Args('input', { type: () => UpdateFieldInput }) input: UpdateFieldInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.fieldsService.updateField(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemDeleteField',
    nullable: true
  })
  async deleteField(
    @Args('input', { type: () => DeleteFieldInput }) input: DeleteFieldInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.fieldsService.deleteField(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemUpdateFieldsDisplayOrder',
    nullable: true
  })
  async updateFieldsDisplayOrder(
    @Args('input', { type: () => UpdateFieldsDisplayOrderInput })
    input: UpdateFieldsDisplayOrderInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.fieldsService.updateFieldsDisplayOrder(user, input)
  }
}
