import { Type } from 'class-transformer'
import {
  Allow,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import { AppealSummonsAppellantSide } from '@island.is/judicial-system/types'

@InputType()
export class AppealSummonsDefendantInput {
  @Allow()
  @IsUUID()
  @Field(() => ID)
  readonly defendantId!: string

  @Allow()
  @IsEnum(AppealSummonsAppellantSide)
  @Field(() => AppealSummonsAppellantSide)
  readonly appellantSide!: AppealSummonsAppellantSide

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
