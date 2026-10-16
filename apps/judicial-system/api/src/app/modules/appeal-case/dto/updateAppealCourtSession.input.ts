import {
  Allow,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import { AppealCourtSessionType } from '@island.is/judicial-system/types'

@InputType()
export class UpdateAppealCourtSessionInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly appealCaseId!: string

  @Allow()
  @Field(() => ID)
  readonly appealCourtSessionId!: string

  @Allow()
  @IsOptional()
  @IsEnum(AppealCourtSessionType)
  @Field(() => AppealCourtSessionType, { nullable: true })
  readonly sessionType?: AppealCourtSessionType

  @Allow()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  readonly sessionDate?: string

  @Allow()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  readonly courtRoom?: string
}
