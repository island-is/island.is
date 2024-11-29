import { Args, Resolver, Mutation } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { ServicesService } from './services.service'
import { Translation } from '../../models/services.model'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'
import { GetTranslationInput } from '../../dto/service.input'

@Resolver()
@UseGuards(IdsUserGuard)
@Audit({ namespace: '@island.is/api/form-system' })
export class ServicesResolver {
  constructor(private readonly formSystemServices: ServicesService) {}

  @Mutation(() => Translation, {
    name: 'formSystemGetTranslation',
  })
  async getTranslation(
    @Args('input', { type: () => GetTranslationInput })
    input: GetTranslationInput,
    @CurrentUser() user: User,
  ): Promise<Translation> {
    return this.formSystemServices.getTranslation(user, input)
  }
}
