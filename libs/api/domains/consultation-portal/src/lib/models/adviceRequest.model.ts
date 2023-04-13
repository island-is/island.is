import { ObjectType, Field, InputType } from '@nestjs/graphql'
import { AdviceFileRequest } from './adviceFileRequest.model'

@ObjectType('ConsultationPortalAdviceRequest')
@InputType('ConsultationPortalAdviceRequestInput')
export class AdviceRequest {
  @Field(() => String, { nullable: true })
  content?: string | null

  @Field(() => [String], { nullable: true })
  adviceFiles?: string[] | null
}
