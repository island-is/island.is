import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteDraftRegulationChangeInput {
  @Field(() => String)
  id!: string
}
