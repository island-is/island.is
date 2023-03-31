import { ObjectType, Field, InputType } from '@nestjs/graphql'

@ObjectType('ConsultationPortalAdviceFileRequest')
@InputType('ConsultationPortalAdviceFileRequestInput')
export class AdviceFileRequest {
  @Field(() => String, { nullable: true })
  fileName?: string | null

  @Field(() => String, { nullable: true })
  base64Document?: string | null
}
