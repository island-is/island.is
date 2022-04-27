import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Election {
  @Field()
  name!: string

  @Field()
  year!: number

  @Field()
  month!: number

  @Field({ nullable: true })
  ageLimit?: number
}
