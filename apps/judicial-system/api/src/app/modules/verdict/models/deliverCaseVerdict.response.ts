import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeliverCaseVerdictResponse {
  @Field(() => Boolean)
  readonly queued!: boolean
}
