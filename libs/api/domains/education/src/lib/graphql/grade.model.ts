import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class Grade {
  @Field(() => ID)
  id!: number

  @Field(() => String)
  grade!: number // 61

  @Field(() => String)
  competence!: string // A+

  @Field(() => String)
  programme!: string

  @Field(() => String)
  date!: string
}
