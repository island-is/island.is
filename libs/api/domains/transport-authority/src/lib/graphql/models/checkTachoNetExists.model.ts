import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CheckTachoNetExists {
  @Field(() => Boolean)
  exists!: boolean
}
