import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('DocumentProviderDashboardProviderStatisticInfo')
export class DocumentProviderDashboardProviderStatisticInfo {
  @Field(() => Int)
  published!: number

  @Field(() => Int)
  notifications!: number

  @Field(() => Int)
  opened!: number

  @Field(() => Int)
  failures!: number
}
