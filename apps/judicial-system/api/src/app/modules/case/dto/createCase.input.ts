import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import type {
  CaseGender,
  CaseType,
  CreateCase,
} from '@island.is/judicial-system/types'

@InputType()
export class CreateCaseInput implements CreateCase {
  @Allow()
  @Field(() => String)
  readonly type!: CaseType

  @Allow()
  @Field({ nullable: true })
  readonly description?: string

  @Allow()
  @Field()
  readonly policeCaseNumber!: string

  @Allow()
  @Field()
  readonly accusedNationalId!: string

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
  readonly defenderName?: string

  @Allow()
  @Field({ nullable: true })
  readonly defenderEmail?: string

  @Allow()
  @Field({ nullable: true })
  readonly defenderPhoneNumber?: string

  @Allow()
  @Field({ nullable: true })
  readonly sendRequestToDefender?: boolean

  @Allow()
  @Field({ nullable: true })
  readonly courtId?: string

  @Allow()
  @Field({ nullable: true })
  readonly leadInvestigator?: string
}
