import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemCreateOrganizationUrlInput')
export class OrganizationUrlCreateInput {
  @Field(() => String, { nullable: true })
  organizationNationalId?: string

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => Boolean, { nullable: true })
  isTest?: boolean
}

@InputType('FormSystemUpdateOrganizationUrlInput')
export class OrganizationUrlUpdateInput {
  @Field(() => String, { nullable: true })
  url?: string

  @Field(() => String, { nullable: true })
  method?: string

  @Field(() => Boolean, { nullable: true })
  isXroad?: boolean
}
