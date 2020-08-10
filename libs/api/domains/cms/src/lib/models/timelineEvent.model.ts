import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TimelineEvent {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  date: string

  @Field(() => Int, { nullable: true })
  numerator: number

  @Field(() => Int, { nullable: true })
  denominator: number

  @Field()
  label: string

  @Field({ nullable: true })
  body: string

  @Field(() => [String])
  tags: string[]

  @Field()
  link: string
}
