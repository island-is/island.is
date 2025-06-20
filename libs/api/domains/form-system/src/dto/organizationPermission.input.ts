import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemOrganizationPermissionDtoInput')
export class OrganizationPermissionDtoInput {
  @Field(() => String, { nullable: true })
  organizationNationalId?: string

  @Field(() => String, { nullable: true })
  permission?: string
}

@InputType('FormSystemUpdateOrganizationPermissionInput')
export class OrganizationPermissionUpdateInput {
  @Field(() => OrganizationPermissionDtoInput, { nullable: true })
  updateOrganizationPermissionDto?: OrganizationPermissionDtoInput
}
