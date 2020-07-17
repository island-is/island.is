import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TimelineEvent {
  @Field((type) => ID)
  id: string

  @Field()
  title: string

  @Field()
  date: string

  @Field((type) => Int, { nullable: true })
  numerator: number

  @Field((type) => Int, { nullable: true })
  denominator: number

  @Field()
  label: string

  @Field({ nullable: true })
  body: string

  @Field((type) => [String])
  tags: string[]

  @Field()
  link: string
}
