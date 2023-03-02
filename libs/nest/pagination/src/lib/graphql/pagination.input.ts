import { Field, InputType, Int } from '@nestjs/graphql'

export function PaginationInput() {
  @InputType()
  abstract class PaginationInputClass {
    @Field(() => Int, { nullable: true })
    limit?: number

    @Field(() => String, { nullable: true })
    before?: string

    @Field(() => String, { nullable: true })
    after?: string
  }

  return PaginationInputClass
}
