import {
  Allow,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator'
import { GraphQLJSONObject } from 'graphql-type-json'

import { Field, ID, InputType } from '@nestjs/graphql'

import type {
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from '@island.is/judicial-system/types'
import {
  CaseType,
  RequestSharedWithDefender,
} from '@island.is/judicial-system/types'

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
}
