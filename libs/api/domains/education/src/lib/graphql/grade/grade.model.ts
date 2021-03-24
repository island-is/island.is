import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class Grade {
  @Field(() => Number)
  grade!: number // 61

  @Field(() => String)
  competence?: string // A

  @Field(() => String)
  competenceStatus?: string // A1

  @Field(() => Number)
  weight?: number // 80%
}
