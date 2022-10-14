import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthDomain')
export class Domain {
  @Field(() => String)
  name!: string

  @Field(() => String)
  displayName!: string

  @Field(() => String)
  description!: string

  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  organisationLogoKey!: string
}
