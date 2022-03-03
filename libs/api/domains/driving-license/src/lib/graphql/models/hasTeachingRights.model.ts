import { Field, ID,ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HasTeachingRights {
  @Field(() => ID)
  nationalId!: string

  @Field()
  hasTeachingRights!: boolean
}
