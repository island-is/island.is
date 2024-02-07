import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ConsultationPortalCaseItemResult')
export class CaseItemResult {
  @Field({ nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  caseNumber?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field({ nullable: true })
  adviceCount?: number

  @Field(() => String, { nullable: true })
  shortDescription?: string | null

  @Field(() => String, { nullable: true })
  statusName?: string | null

  @Field(() => String, { nullable: true })
  institutionName?: string | null

  @Field(() => String, { nullable: true })
  typeName?: string | null

  @Field(() => String, { nullable: true })
  policyAreaName?: string | null

  @Field({ nullable: true })
  publishOnWeb?: Date

  @Field({ nullable: true })
  processBegins?: Date

  @Field({ nullable: true })
  processEnds?: Date

  @Field({ nullable: true })
  created?: Date
}
