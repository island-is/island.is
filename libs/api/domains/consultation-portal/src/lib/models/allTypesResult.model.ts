import { Field, ObjectType } from '@nestjs/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'

@ObjectType('ConsultationPortalAllTypesResult')
export class AllTypesResult {
  @Field(() => GraphQLJSONObject, { nullable: true })
  policyAreas?: { [key: string]: string } | null

  @Field(() => GraphQLJSONObject, { nullable: true })
  institutions?: { [key: string]: string } | null

  @Field(() => GraphQLJSONObject, { nullable: true })
  caseStatuses?: { [key: string]: string } | null

  @Field(() => GraphQLJSONObject, { nullable: true })
  caseTypes?: { [key: string]: string } | null
}
