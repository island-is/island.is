import { Allow, IsArray, IsOptional } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { CaseAppealState } from '@island.is/judicial-system/types'

@InputType()
export class CaseListQueryInput {
  @Allow()
  @IsOptional()
  @IsArray()
  @Field(() => [CaseAppealState], { nullable: true })
  readonly appealState?: [CaseAppealState]
}
