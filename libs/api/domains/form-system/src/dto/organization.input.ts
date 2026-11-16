import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemGetOrganizationAdminInput')
export class GetOrganizationAdminInput {
  @Field(() => String)
  nationalId!: string
}

@InputType('FormSystemCreateOrganizationInput')
export class CreateOrganizationInput extends GetOrganizationAdminInput {}
