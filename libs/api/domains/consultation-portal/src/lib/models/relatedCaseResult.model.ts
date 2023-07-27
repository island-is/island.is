import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ConsultationPortalRelatedCaseResult')
export class RelatedCaseResult {
  @Field(() => Number, { nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  caseNumber?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null
}
