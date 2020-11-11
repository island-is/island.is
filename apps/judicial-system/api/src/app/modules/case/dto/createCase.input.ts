import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { CaseGender, CreateCase } from '@island.is/judicial-system/types'

@InputType()
export class CreateCaseInput implements CreateCase {
  @Allow()
  @Field()
  readonly policeCaseNumber: string

  @Allow()
  @Field()
  readonly accusedNationalId: string

  @Allow()
  @Field({ nullable: true })
  readonly accusedName?: string

  @Allow()
  @Field({ nullable: true })
  readonly accusedAddress?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly accusedGender?: CaseGender

  @Allow()
  @Field({ nullable: true })
  readonly requestedDefenderName?: string

  @Allow()
  @Field({ nullable: true })
  readonly requestedDefenderEmail?: string

  @Allow()
  @Field({ nullable: true })
  readonly court?: string

  @Allow()
  @Field({ nullable: true })
  readonly arrestDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly requestedCourtDate?: string
}
