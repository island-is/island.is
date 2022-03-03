import { Field, ID,ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Teacher {
  @Field(() => ID)
  nationalId!: string

  @Field()
  name!: string
}
