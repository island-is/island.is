import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemOrganizationLogoInput')
export class OrganizationLogoInput {
  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  logo!: string
}
