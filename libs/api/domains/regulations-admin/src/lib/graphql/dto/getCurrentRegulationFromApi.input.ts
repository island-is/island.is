import { RegName } from '@island.is/regulations'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetCurrentRegulationFromApiInput {
  @Field(() => String)
  regulation!: RegName
}
