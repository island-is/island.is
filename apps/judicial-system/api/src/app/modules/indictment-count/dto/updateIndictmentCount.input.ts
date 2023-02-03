import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateIndictmentCountInput {
  @Allow()
  @Field()
  readonly caseId!: string

  @Allow()
  @Field()
  readonly indictmentCountId!: string

  @Allow()
  @Field({ nullable: true })
  readonly policeCaseNumber?: string

  @Allow()
  @Field({ nullable: true })
  readonly vehicleRegistrationNumber?: string

  @Allow()
  @Field({ nullable: true })
  readonly incidentDescription?: string

  @Allow()
  @Field({ nullable: true })
  readonly legalArguments?: string
}
