import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentEntity')
export class Entity {
  @Field(() => ID)
  id!: number

  @Field()
  name!: string
}
