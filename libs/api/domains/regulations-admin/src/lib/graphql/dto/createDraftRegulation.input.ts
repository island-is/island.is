import { RegulationType } from '@island.is/regulations'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateDraftRegulationInput {
  @Field(() => String, { nullable: true })
  type?: RegulationType
}
