import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class EndorsementPaginationInput {
  @Field({ nullable: true })
  limit?: number

  @Field({ nullable: true })
  before?: string

  @Field({ nullable: true })
  after?: string
}
