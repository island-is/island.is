import { Allow, IsArray, IsEnum, IsOptional } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import {
  CaseAppealRulingDecision,
  UserRole,
} from '@island.is/judicial-system/types'

@InputType()
export class UpdateAppealCaseInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly appealCaseId!: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly appealCaseNumber?: string

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly appealAssistantId?: string

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly appealJudge1Id?: string

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly appealJudge2Id?: string

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly appealJudge3Id?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly appealConclusion?: string

  @Allow()
  @IsOptional()
  @Field(() => CaseAppealRulingDecision, { nullable: true })
  readonly appealRulingDecision?: CaseAppealRulingDecision

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly appealRulingModifiedHistory?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly appealValidToDate?: string

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly isAppealCustodyIsolation?: boolean

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly appealIsolationToDate?: string

  @Allow()
  @IsOptional()
  @IsArray()
  @IsEnum(UserRole, { each: true })
  @Field(() => [UserRole], { nullable: true })
  readonly requestAppealRulingNotToBePublished?: UserRole[]

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly prosecutorStatementDate?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly defendantStatementDate?: string
}
