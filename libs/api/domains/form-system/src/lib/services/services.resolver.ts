import { Query, Args, Resolver, Mutation } from "@nestjs/graphql";
import { CurrentUser, type User } from '@island.is/auth-nest-tools'
import { FormSystemService } from "./services.service";
import { List } from "../../models/services.model";


@Resolver()
export class FormSystemServicesResolver {
  constructor(private readonly formSystemServices: FormSystemService) { }

  @Query(() => List, {
    name: 'formSystemGetCountries'
  })
  async getCountries(
    @CurrentUser() user: User
  ): Promise<List> {
    return this.formSystemServices.getCountries(user)
  }

  @Query(() => List, {
    name: 'formSystemGetZipCodes'
  })
  async getZipCodes(
    @CurrentUser() user: User
  ): Promise<List> {
    return this.formSystemServices.getZipCodes(user)
  }

  @Query(() => List, {
    name: 'formSystemGetMunicipalities'
  })
  async getMunicipalities(
    @CurrentUser() user: User
  ): Promise<List> {
    return this.formSystemServices.getMunicipalities(user)
  }

  @Query(() => List, {
    name: 'formSystemGetRegistrationCategories'
  })
  async getRegistrationCategories(
    @CurrentUser() user: User
  ): Promise<List> {
    return this.formSystemServices.getRegistrationCategories(user)
  }

  @Query(() => List, {
    name: 'formSystemGetTradesProfessions'
  })
  async getTradesProfessions(
    @CurrentUser() user: User
  ): Promise<List> {
    return this.formSystemServices.getTradesProfessions(user)
  }

  @Query(() => List, {
    name: 'formSystemGetProperty'
  })
  async getProperty(
    @Args('input', { type: () => ({ propertyId: String }) }) input: { propertyId: string },
    @CurrentUser() user: User
  ): Promise<List> {
    return this.formSystemServices.getProperty(user, input)
  }
}
