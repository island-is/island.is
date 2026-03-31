import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class OJOIAGetRegulationImpactsInput {
  @Field()
  regulation!: string
}
