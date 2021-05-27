import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class HasTeachingRights {
  @Field(() => ID)
  nationalId!: string

  @Field()
  hasTeachingRights!: boolean
}
