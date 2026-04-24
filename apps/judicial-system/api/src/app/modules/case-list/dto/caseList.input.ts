import { Allow, IsArray, IsOptional } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { AppealCaseState } from '@island.is/judicial-system/types'

@InputType()
export class CaseListQueryInput {
  @Allow()
  @IsOptional()
  @IsArray()
  @Field(() => [AppealCaseState], { nullable: true })
  readonly appealState?: [AppealCaseState]
}
