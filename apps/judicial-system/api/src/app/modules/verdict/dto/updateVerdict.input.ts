import { Allow, IsOptional } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import {
  InformationForDefendant,
  ServiceRequirement,
<<<<<<< HEAD
=======
  VerdictAppealDecision,
>>>>>>> 80a2e3ccd27738c0e5fc56f6b706da58fd06e43d
} from '@island.is/judicial-system/types'

@InputType()
export class UpdateVerdictInput {
  @Allow()
  @Field(() => ID)
  readonly defendantId!: string

  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @IsOptional()
  @Field(() => ServiceRequirement, { nullable: true })
  readonly serviceRequirement?: ServiceRequirement

  @Allow()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  readonly serviceDate?: Date

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly servedBy?: string

  @Allow()
  @IsOptional()
<<<<<<< HEAD
  @Field(() => String, { nullable: true })
  readonly appealDecision?: string

  @Allow()
  @IsOptional()
  @Field(() => Date, { nullable: true })
=======
  @Field(() => VerdictAppealDecision, { nullable: true })
  readonly appealDecision?: VerdictAppealDecision

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
>>>>>>> 80a2e3ccd27738c0e5fc56f6b706da58fd06e43d
  readonly appealDate?: string

  @Allow()
  @IsOptional()
  @Field(() => [InformationForDefendant], { nullable: true })
  readonly serviceInformationForDefendant?: InformationForDefendant[]
}
