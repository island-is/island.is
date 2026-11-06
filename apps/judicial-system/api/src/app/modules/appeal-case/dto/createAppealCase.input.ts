import { Allow, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator'

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

  // When the verdict appeal was filed. Only honoured when the public prosecution
  // office registers an appeal that reached it outside the system - by letter or
  // email; a defender appealing in the system appeals now.
  @Allow()
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly appealDate?: string

  // The defender who filed the verdict appeal the public prosecution office is
  // registering. Recorded on the defendant as information only.
  @Allow()
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly appealDefenderName?: string

  @Allow()
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly appealDefenderNationalId?: string

  @Allow()
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly appealDefenderEmail?: string

  @Allow()
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly appealDefenderPhoneNumber?: string
}
