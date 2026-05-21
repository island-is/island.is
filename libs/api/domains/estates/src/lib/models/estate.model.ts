import { Field, ID, ObjectType } from '@nestjs/graphql'
import { GraphQLISODateTime } from '@nestjs/graphql'
import { EstatesRepresentative } from './estateRepresentative.model'

@ObjectType()
export class EstatesEstate {
  @Field(() => ID)
  id!: string

  @Field()
  nameOfDeceased!: string

  @Field()
  nationalIdOfDeceased!: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateOfDeath?: Date

  @Field({ nullable: true })
  isFinished?: boolean

  @Field(() => EstatesRepresentative, { nullable: true })
  representative?: EstatesRepresentative
}
