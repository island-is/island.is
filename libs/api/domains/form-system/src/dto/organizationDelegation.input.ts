import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemOrganizationDelegationDtoInput')
export class OrganizationDelegationDtoInput {
  @Field(() => String, { nullable: true })
  organizationNationalId?: string

  @Field(() => String, { nullable: true })
  delegation?: string
}

@InputType('FormSystemUpdateOrganizationDelegationInput')
export class OrganizationDelegationUpdateInput {
  @Field(() => OrganizationDelegationDtoInput, { nullable: true })
  updateOrganizationDelegationDto?: OrganizationDelegationDtoInput
}
