import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class BanMarking {
  @Field(() => Boolean)
  banMarked?: boolean

  @Field(() => String)
  startDate?: string
}
