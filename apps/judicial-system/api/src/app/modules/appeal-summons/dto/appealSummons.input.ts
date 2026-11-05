import { Type } from 'class-transformer'
import {
  Allow,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class AppealSummonsDefendantInput {
  @Allow()
  @IsUUID()
  @Field(() => ID)
  readonly defendantId!: string

  @Allow()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  readonly claims!: string
}

@InputType()
export class CreateAppealSummonsInput {
  @Allow()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AppealSummonsDefendantInput)
  @Field(() => [AppealSummonsDefendantInput])
  readonly defendants!: AppealSummonsDefendantInput[]
}

@InputType()
export class UpdateAppealSummonsInput {
  @Allow()
  @IsUUID()
  @Field(() => ID)
  readonly appealSummonsId!: string

  @Allow()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AppealSummonsDefendantInput)
  @Field(() => [AppealSummonsDefendantInput])
  readonly defendants!: AppealSummonsDefendantInput[]
}

@InputType()
export class DeleteAppealSummonsInput {
  @Allow()
  @IsUUID()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @IsUUID()
  @Field(() => ID)
  readonly appealSummonsId!: string
}

@InputType()
export class ConfirmAppealSummonsInput {
  @Allow()
  @IsUUID()
  @Field(() => ID)
  readonly appealSummonsId!: string
}

@InputType()
export class SendAppealSummonsToCourtOfAppealsInput {
  @Allow()
  @IsUUID()
  @Field(() => ID)
  readonly appealSummonsId!: string
}
