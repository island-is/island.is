import { Allow, IsEnum, IsNotEmpty, IsString } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import { AppealCourtSessionType } from '@island.is/judicial-system/types'

@InputType()
export class CreateAppealCourtSessionInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly appealCaseId!: string

  @Allow()
  @IsEnum(AppealCourtSessionType)
  @Field(() => AppealCourtSessionType)
  readonly sessionType!: AppealCourtSessionType

  @Allow()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  readonly sessionDate!: string

  @Allow()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  readonly courtRoom!: string
}
