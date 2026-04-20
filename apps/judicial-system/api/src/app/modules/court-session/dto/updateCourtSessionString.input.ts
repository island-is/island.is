import { Allow, IsEnum, IsOptional, IsString } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import { CourtSessionStringType } from '@island.is/judicial-system/types'

@InputType()
export class UpdateCourtSessionStringInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly courtSessionId!: string

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly mergedCaseId?: string

  @Allow()
  @IsOptional()
  @IsEnum(CourtSessionStringType)
  @Field(() => CourtSessionStringType, { nullable: true })
  readonly stringType?: CourtSessionStringType

  @Allow()
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly value?: string
}
