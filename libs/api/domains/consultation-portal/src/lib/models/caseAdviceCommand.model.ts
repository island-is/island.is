import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ConsultationPortalCaseAdviceCommand')
export class CaseAdviceCommand {
  @Field(() => String, { nullable: true })
  content?: string | null

  @Field(() => [String], { nullable: true })
  fileUrls?: Array<string> | null
}
