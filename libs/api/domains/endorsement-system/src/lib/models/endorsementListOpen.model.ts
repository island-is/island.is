import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class EndorsementListOpen {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  description!: string | null
}
