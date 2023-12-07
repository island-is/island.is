import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SignatureCollectionArea {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field()
  min!: number

  @Field()
  max!: number
}
