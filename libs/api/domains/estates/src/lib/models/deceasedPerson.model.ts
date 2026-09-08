import { Field, ObjectType } from '@nestjs/graphql'
import { GraphQLISODateTime } from '@nestjs/graphql'

@ObjectType('EstatesDeceasedPerson')
export class DeceasedPerson {
  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  nationalId?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateOfDeath?: Date
}
