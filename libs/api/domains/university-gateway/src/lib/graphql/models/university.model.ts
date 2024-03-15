import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('UniversityGatewayUniversity')
export class UniversityGatewayUniversity {
  @Field()
  id!: string

  @Field()
  nationalId!: string

  @Field()
  contentfulKey!: string

  @Field(() => String, { nullable: true })
  contentfulLogoUrl?: string

  @Field(() => String, { nullable: true })
  contentfulTitle?: string
}
