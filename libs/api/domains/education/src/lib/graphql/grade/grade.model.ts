import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class Grade {
  @Field(() => String)
  grade!: string // 61

  @Field(() => String, { nullable: true })
  weight?: string // 80%
}
