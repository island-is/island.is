import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FormSystemOrganizationUrl')
export class OrganizationUrl {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  url?: string

  @Field(() => Boolean, { nullable: true })
  isXroad?: boolean

  @Field(() => Boolean, { nullable: true })
  isTest?: boolean

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => String, { nullable: true })
  method?: string
}
