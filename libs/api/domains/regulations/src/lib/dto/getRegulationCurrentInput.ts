import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetRegulationCurrentInput {
  @Field()
  regulationName!: string
}
