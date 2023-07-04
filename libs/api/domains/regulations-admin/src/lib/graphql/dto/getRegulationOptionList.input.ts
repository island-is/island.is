import { RegName } from '@island.is/regulations'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetRegulationOptionListInput {
  @Field(() => [String], { nullable: true })
  names!: Array<RegName>
}
