import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class OJOIACreateDraftRegulationInput {
  @Field()
  type!: string // 'base' | 'amending'
}
