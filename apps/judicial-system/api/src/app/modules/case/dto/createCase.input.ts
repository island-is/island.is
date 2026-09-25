import { Type } from 'class-transformer'
import {
  Allow,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator'
import { GraphQLJSONObject } from 'graphql-type-json'

import { Field, ID, InputType } from '@nestjs/graphql'

import { POLICE_CASE_NUMBER_REGEX } from '@island.is/judicial-system/consts'
import type {
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from '@island.is/judicial-system/types'
import {
  CaseType,
  Gender,
  RequestSharedWithDefender,
} from '@island.is/judicial-system/types'

// A defendant created together with the case. The same fields a prosecutor
// can enter for a defendant before the case exists.
@InputType()
export class CreateCaseDefendantInput {
  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly noNationalId?: boolean

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly nationalId?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly name?: string

  @Allow()
  @IsOptional()
  @Field(() => Gender, { nullable: true })
  readonly gender?: Gender

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly address?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly citizenship?: string
}

@InputType()
export class CreateCaseInput {
  @Allow()
  @Field(() => CaseType)
  readonly type!: CaseType

  @Allow()
  @IsOptional()
  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly indictmentSubtypes?: IndictmentSubtypeMap

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly description?: string

  @Allow()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Matches(POLICE_CASE_NUMBER_REGEX, { each: true })
  @Field(() => [String])
  readonly policeCaseNumbers!: string[]

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly defenderName?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly defenderNationalId?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly defenderEmail?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly defenderPhoneNumber?: string

  @Allow()
  @IsOptional()
  @Field(() => RequestSharedWithDefender, { nullable: true })
  readonly requestSharedWithDefender?: RequestSharedWithDefender

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly leadInvestigator?: string

  @Allow()
  @IsOptional()
  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly crimeScenes?: CrimeSceneMap

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly prosecutorId?: string

  @Allow()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCaseDefendantInput)
  @Field(() => [CreateCaseDefendantInput], { nullable: true })
  readonly defendants?: CreateCaseDefendantInput[]
}
