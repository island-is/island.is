import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemCreateOrganizationUrlInput')
export class CreateOrganizationUrlInput {
  @Field(() => String, { nullable: true })
  organizationNationalId?: string

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => String, { nullable: true })
  method?: string

  @Field(() => Boolean, { nullable: true })
  isTest?: boolean
}

@InputType('FormSystemUpdateOrganizationUrlInput')
export class UpdateOrganizationUrlInput {
  @Field(() => String, { nullable: true })
  url?: string

  @Field(() => String, { nullable: true })
  method?: string

  @Field(() => Boolean, { nullable: true })
  isXroad?: boolean
}

@InputType('FormSystemDeleteOrganizationUrlInput')
export class DeleteOrganizationUrlInput {
  @Field(() => String, { nullable: true })
  id?: string
}
