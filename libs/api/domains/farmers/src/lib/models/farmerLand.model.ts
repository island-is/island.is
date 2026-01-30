import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('FarmerLand')
export class FarmerLand {
  @Field(() => ID)
  id!: number

  @Field()
  name!: string
}
