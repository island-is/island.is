import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class OJOIAGetRegulationOptionListInput {
  @Field(() => [String])
  names!: string[]
}
