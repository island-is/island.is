import { Field, InputType, ObjectType } from '@nestjs/graphql'

@ObjectType('ConsultationPortalCaseAdviceCommand')
@InputType('ConsultationPortalCaseAdviceCommandInput')
export class CaseAdviceCommand {
  @Field(() => String, { nullable: true })
  content?: string | null

  @Field(() => [String], { nullable: true })
  fileUrls?: Array<string> | null
}
