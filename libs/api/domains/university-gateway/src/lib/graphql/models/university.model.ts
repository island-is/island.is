import { Field, ObjectType } from '@nestjs/graphql'

export
@ObjectType('University')
class University {
  @Field()
  id!: string

  @Field()
  nationalId!: string

  // @Field()
  // contentfulKey!: string

  @Field()
  logoUrl!: string

  @Field()
  title!: string
}
