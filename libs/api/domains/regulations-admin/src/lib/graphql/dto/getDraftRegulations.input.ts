import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetDraftRegulationsInput {
  @Field(() => Number)
  page?: number
}
