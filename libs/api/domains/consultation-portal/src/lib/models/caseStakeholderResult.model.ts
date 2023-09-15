import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ConsultationPortalCaseStakeholderResult')
export class CaseStakeholderResult {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  email?: string | null
}
