import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { OrganizationsService } from "./organizations.services";
import { CreateOrganizationInput } from "../../dto/organization.input";
import { CurrentUser, type User } from '@island.is/auth-nest-tools'



@Resolver()
export class OrganizationsResolver {
  constructor(private readonly organizationsService: OrganizationsService) { }

  @Mutation(() => CreateOrganizationInput, {
    name: 'formSystemCreateOrganization'
  })
  async postOrganization(
    @Args('input', { type: () => CreateOrganizationInput }) input: CreateOrganizationInput,
    @CurrentUser() user: User
  ): Promise<CreateOrganizationInput> {
    return this.organizationsService.postOrganization(user, input)
  }
}
