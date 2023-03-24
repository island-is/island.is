import { ObjectType, Field } from '@nestjs/graphql'
import { AdviceFileRequest } from './adviceFileRequest.model'

@ObjectType('ConsultationPortalAdviceRequest')
export class AdviceRequest {
  @Field(() => String, { nullable: true })
  content?: string | null

  @Field(() => [AdviceFileRequest], { nullable: true })
  adviceFiles?: AdviceFileRequest[] | null
}
