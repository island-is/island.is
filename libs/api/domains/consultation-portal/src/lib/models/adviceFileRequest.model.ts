import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('ConsultationPortalAdviceFileRequest')
export class AdviceFileRequest {
  @Field(() => String, { nullable: true })
  fileName?: string | null

  @Field(() => String, { nullable: true })
  base64Document?: string | null
}
