import { Field, InputType } from '@nestjs/graphql'

@InputType('WebSupremeCourtDeterminationByIdInput')
export class SupremeCourtDeterminationByIdInput {
  @Field(() => String)
  id!: string
}
