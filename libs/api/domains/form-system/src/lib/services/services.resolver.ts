import { Query, Args, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { FormSystemService } from './services.service'
import { List } from '../../models/services.model'
import { GetPropertyInput } from '../../dto/services.input'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'

@Resolver()
@UseGuards(IdsUserGuard)
@Audit({ namespace: '@island.is/api/form-system' })
export class FormSystemServicesResolver {
  constructor(private readonly formSystemServices: FormSystemService) {}

  @Query(() => List, {
    name: 'formSystemGetCountries',
  })
  async getCountries(@CurrentUser() user: User): Promise<List> {
    return this.formSystemServices.getCountries(user)
  }

  @Query(() => List, {
    name: 'formSystemGetZipCodes',
  })
  async getZipCodes(@CurrentUser() user: User): Promise<List> {
    return this.formSystemServices.getZipCodes(user)
  }

  @Query(() => List, {
    name: 'formSystemGetMunicipalities',
  })
  async getMunicipalities(@CurrentUser() user: User): Promise<List> {
    return this.formSystemServices.getMunicipalities(user)
  }

  @Query(() => List, {
    name: 'formSystemGetRegistrationCategories',
  })
  async getRegistrationCategories(@CurrentUser() user: User): Promise<List> {
    return this.formSystemServices.getRegistrationCategories(user)
  }

  @Query(() => List, {
    name: 'formSystemGetTradesProfessions',
  })
  async getTradesProfessions(@CurrentUser() user: User): Promise<List> {
    return this.formSystemServices.getTradesProfessions(user)
  }

  @Query(() => List, {
    name: 'formSystemGetProperty',
  })
  async getProperty(
    @Args('input', { type: () => GetPropertyInput }) input: GetPropertyInput,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.formSystemServices.getProperty(user, input)
  }
}
