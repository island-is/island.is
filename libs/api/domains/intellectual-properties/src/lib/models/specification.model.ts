import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('IntellectualPropertiesSpecification')
export class Specification {
  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  number?: string

  @Field(() => String, { nullable: true })
  designIsDecoration?: string

  @Field(() => String, { nullable: true })
  designShouldBeProtectedInColors?: string

  @Field(() => String, { nullable: true })
  specificationText?: string

  @Field(() => String, { nullable: true })
  specificationCount?: string
}
