import { Allow, IsOptional } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import {
  InformationForDefendant,
  ServiceRequirement,
  ServiceStatus,
} from '@island.is/judicial-system/types'

@InputType()
export class UpdateVerdictInput {
  @Allow()
  @Field(() => ID)
  readonly verdictId!: string

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
  @Field(() => ServiceStatus, { nullable: true })
  readonly serviceStatus?: ServiceStatus

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
  @Field(() => String, { nullable: true })
  readonly appealDecision?: string

  @Allow()
  @IsOptional()
  @Field(() => [InformationForDefendant], { nullable: true })
  readonly serviceInformationForDefendant?: InformationForDefendant[]
}
