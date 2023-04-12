import { Field, ObjectType } from '@nestjs/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'
import { CaseItemResult } from './caseItemResult.model'

@ObjectType('ConsultationPortalCasesAggregateResult')
export class CasesAggregateResult {
  @Field(() => Number)
  total?: number

  @Field(() => [CaseItemResult], { nullable: true })
  cases?: Array<CaseItemResult> | null

  @Field(() => GraphQLJSONObject, { nullable: true })
  filterGroups?: { [key: string]: { [key: string]: number } } | null
}
