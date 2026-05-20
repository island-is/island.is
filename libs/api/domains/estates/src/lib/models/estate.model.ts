import { Field, ObjectType } from '@nestjs/graphql'
import { GraphQLISODateTime } from '@nestjs/graphql'

@ObjectType()
export class EstatesEstate {
  @Field({ description: 'The probate court case number (dánarbúsnúmer)' })
  caseNumber!: string

  @Field()
  nameOfDeceased!: string

  @Field()
  nationalIdOfDeceased!: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateOfDeath?: Date
}
