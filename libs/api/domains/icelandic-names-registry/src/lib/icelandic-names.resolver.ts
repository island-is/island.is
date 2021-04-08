import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { BackendAPI } from './services'
import { IcelandicName } from './models/icelandicName.model'
import {
  GetIcelandicNameByIdInput,
  GetIcelandicNameByInitialLetterInput,
  IcelandicNameBody,
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

  @Mutation(() => IcelandicName, { nullable: true })
  async updateIcelandicNameById(
    @Args('input', { type: () => IcelandicNameBody })
    input: IcelandicNameBody,
  ): Promise<IcelandicName> {
    const { id, ...body } = input

    return this.backendAPI.updateById(id, body)
  }

  @Mutation(() => IcelandicName, { nullable: true })
  async createIcelandicName(
    @Args('input', { type: () => IcelandicNameBody })
    input: IcelandicNameBody,
  ): Promise<IcelandicName> {
    return this.backendAPI.create(input)
  }

  @Mutation(() => IcelandicName, { nullable: true })
  async deleteIcelandicNameById(
    @Args('input') input: GetIcelandicNameByIdInput,
  ): Promise<void> {
    const { id, ...body } = input

    return this.backendAPI.deleteById(id)
  }
}
