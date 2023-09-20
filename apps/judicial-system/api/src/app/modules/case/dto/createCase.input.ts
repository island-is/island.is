import { Allow, ArrayMinSize, IsArray, IsString } from 'class-validator'
import { GraphQLJSONObject } from 'graphql-type-json'

import { Field, InputType } from '@nestjs/graphql'

import type {
  CaseType,
  CreateCase,
  CrimeSceneMap,
  IndictmentSubtypeMap,
  RequestSharedWithDefender,
} from '@island.is/judicial-system/types'

@InputType()
export class CreateCaseInput implements CreateCase {
  @Allow()
  @Field(() => String)
  readonly type!: CaseType

  @Allow()
  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly indictmentSubtypes?: IndictmentSubtypeMap

  @Allow()
  @Field({ nullable: true })
  readonly description?: string

  @Allow()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Field(() => [String])
  readonly policeCaseNumbers!: string[]

  @Allow()
  @Field({ nullable: true })
  readonly defenderName?: string

  @Allow()
  @Field({ nullable: true })
  readonly defenderNationalId?: string

  @Allow()
  @Field({ nullable: true })
  readonly defenderEmail?: string

  @Allow()
  @Field({ nullable: true })
  readonly defenderPhoneNumber?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly requestSharedWithDefender?: RequestSharedWithDefender

  @Allow()
  @Field({ nullable: true })
  readonly leadInvestigator?: string

  @Allow()
  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly crimeScenes?: CrimeSceneMap
}
