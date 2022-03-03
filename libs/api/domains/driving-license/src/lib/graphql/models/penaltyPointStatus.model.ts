import { Field, ID,ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PenaltyPointStatus {
  @Field(() => ID)
  nationalId!: string

  @Field(() => Boolean)
  isPenaltyPointsOk!: boolean
}
