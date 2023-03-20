import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteDraftRegulationCancelInput {
  @Field(() => String)
  id!: string
}
