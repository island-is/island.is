import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { BackendAPI } from './services'
import { IcelandicName } from './models/icelandicName.model'
import {
  GetIcelandicNameByIdInput,
  GetIcelandicNameByInitialLetterInput,
  GetIcelandicNameBySearchInput,
} from './dto/icelandic-name.input'

@Resolver()
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
}
