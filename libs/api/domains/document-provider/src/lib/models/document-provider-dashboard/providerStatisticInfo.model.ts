import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('ProviderStatisticInfo')
export class ProviderStatisticInfo {
  @Field(() => Int)
  published!: number

  @Field(() => Int)
  notifications!: number

  @Field(() => Int)
  opened!: number

  @Field(() => Int)
  failures!: number
}
