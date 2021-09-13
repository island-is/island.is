import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class Grade {
  @Field(() => String, { nullable: true })
  grade?: string // 61

  @Field(() => String)
  label!: string

  @Field(() => Number, { nullable: true })
  weight?: number // 80%
}
