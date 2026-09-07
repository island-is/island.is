import { Allow, IsEnum, IsOptional, IsUUID } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import { AppealCaseType } from '@island.is/judicial-system/types'

@InputType()
export class CreateAppealCaseInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @IsOptional()
  @IsUUID()
  @Field(() => String, { nullable: true })
  readonly rulingFileId?: string

  // Which decision is being appealed. Omitted means ruling appeal which is
  // every appeal that existed before verdict appeals.
  @Allow()
  @IsOptional()
  @IsEnum(AppealCaseType)
  @Field(() => AppealCaseType, { nullable: true })
  readonly appealType?: AppealCaseType

  // The defendant whose verdict is being appealed. Required for - and only
  // meaningful to - verdict appeals, which is filed for one specific defendant.
  @Allow()
  @IsOptional()
  @IsUUID()
  @Field(() => ID, { nullable: true })
  readonly defendantId?: string
}
