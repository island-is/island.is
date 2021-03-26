import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetRegulationOriginalInput {
  @Field()
  regulationName!: string
}
