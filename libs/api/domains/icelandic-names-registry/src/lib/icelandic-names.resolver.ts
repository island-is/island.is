import { Args, Directive, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'

import { BackendAPI } from './services'
import { IcelandicName } from './models/icelandicName.model'
import {
  GetIcelandicNameByIdInput,
  GetIcelandicNameByInitialLetterInput,
  GetIcelandicNameBySearchInput,
  CreateIcelandicNameInput,
  UpdateIcelandicNameInput,
  DeleteIcelandicNameByIdInput,
} from './dto/icelandic-name.input.dto'
import { DeleteNameResponse } from './dto/icelandic-name.response.dto'

const cacheControlDirective = () => `@cacheControl(maxAge: 0)`

@Resolver()
@Directive(cacheControlDirective())
export class IcelandicNamesResolver {
  constructor(private backendAPI: BackendAPI) {}

  @Query(() => [IcelandicName])
  async getAllIcelandicNames(): Promise<IcelandicName[]> {
    return this.backendAPI.getAll()
  }

  @Query(() => IcelandicName)
  async getIcelandicNameById(
    @Args('input') input: GetIcelandicNameByIdInput,
  ): Promise<IcelandicName> {
    return this.backendAPI.getById(input?.id)
  }

  @Query(() => [IcelandicName])
  async getIcelandicNameByInitialLetter(
    @Args('input') input: GetIcelandicNameByInitialLetterInput,
  ): Promise<IcelandicName[]> {
    return this.backendAPI.getByInitialLetter(input?.initialLetter)
  }

  @Query(() => [IcelandicName])
  async getIcelandicNameBySearch(
    @Args('input') input: GetIcelandicNameBySearchInput,
  ): Promise<IcelandicName[]> {
    return this.backendAPI.getBySearch(input?.q)
  }

  @UseGuards(IdsUserGuard)
  @Mutation(() => IcelandicName)
  async updateIcelandicNameById(
    @Args('input', { type: () => UpdateIcelandicNameInput })
    input: UpdateIcelandicNameInput,
    @CurrentUser() { authorization }: User,
  ): Promise<IcelandicName> {
    return this.backendAPI.updateById(input.id, input.body, authorization ?? '')
  }

  @UseGuards(IdsUserGuard)
  @Mutation(() => IcelandicName)
  async createIcelandicName(
    @Args('input') input: CreateIcelandicNameInput,
    @CurrentUser() { authorization }: User,
  ): Promise<IcelandicName> {
    return this.backendAPI.create(input, authorization ?? '')
  }

  @UseGuards(IdsUserGuard)
  @Mutation(() => DeleteNameResponse)
  async deleteIcelandicNameById(
    @Args('input', { type: () => DeleteIcelandicNameByIdInput })
    input: DeleteIcelandicNameByIdInput,
    @CurrentUser() { authorization }: User,
  ): Promise<DeleteNameResponse> {
    await this.backendAPI.deleteById(input.id, authorization ?? '')

    return {
      id: input.id,
    }
  }
}
