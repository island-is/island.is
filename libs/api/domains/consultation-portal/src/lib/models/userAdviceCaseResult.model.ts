import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('ConsultationPortalUserAdviceCaseResult')
export class UserAdviceCaseResult {
  @Field(() => String, { nullable: true })
  caseNumber?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  statusName?: string | null

  @Field(() => String, { nullable: true })
  institutionName?: string | null

  @Field(() => String, { nullable: true })
  typeName?: string | null

  @Field(() => String, { nullable: true })
  policyAreaName?: string | null

  @Field({ nullable: true })
  processBegins?: Date

  @Field({ nullable: true })
  processEnds?: Date
}
