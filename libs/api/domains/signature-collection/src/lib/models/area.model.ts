import { Field, ID, ObjectType } from '@nestjs/graphql'


@ObjectType()
export class Area {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field()
  min!: number

  @Field()
  max!: number

}
