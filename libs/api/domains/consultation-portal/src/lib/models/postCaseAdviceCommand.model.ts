import { Field, InputType, ObjectType } from '@nestjs/graphql'

@ObjectType('ConsultationPortalPostCaseAdviceCommand')
@InputType('ConsultationPortalCasePostAdviceCommandInput')
export class PostCaseAdviceCommand {
  @Field(() => String, { nullable: true })
  content?: string | null

  @Field(() => Boolean, { nullable: true })
  privateAdvice?: boolean

  @Field(() => [String], { nullable: true })
  fileUrls?: Array<string> | null
}
