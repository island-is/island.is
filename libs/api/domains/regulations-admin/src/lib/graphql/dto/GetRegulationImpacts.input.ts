import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetRegulationImpactsInput {
  @Field(() => String)
  regulation!: string
}
