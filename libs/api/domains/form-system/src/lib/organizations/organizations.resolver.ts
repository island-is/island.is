import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { OrganizationsService } from "./organizations.services";
import { CreateOrganizationInput } from "../../dto/organization.input";
import { CurrentUser, type User } from '@island.is/auth-nest-tools'
import { Organization } from "../../models/organization.model";



@Resolver()
export class OrganizationsResolver {
  constructor(private readonly organizationsService: OrganizationsService) { }

  @Mutation(() => Organization, {
    name: 'formSystemCreateOrganization'
  })
  async postOrganization(
    @Args('input', { type: () => CreateOrganizationInput }) input: CreateOrganizationInput,
    @CurrentUser() user: User
  ): Promise<Organization> {
    return this.organizationsService.postOrganization(user, input)
  }
}
