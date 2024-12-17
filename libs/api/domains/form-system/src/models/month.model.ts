import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('FormSystemMonth')
export class Month {
  @Field(() => Int, { nullable: true })
  month?: number

  @Field(() => Int, { nullable: true })
  amount?: number

  @Field(() => [Int], { nullable: true })
  days?: number[]
}
