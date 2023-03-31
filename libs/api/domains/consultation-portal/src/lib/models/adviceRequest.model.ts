import { ObjectType, Field, InputType } from '@nestjs/graphql'
import { AdviceFileRequest } from './adviceFileRequest.model'

@ObjectType('ConsultationPortalAdviceRequest')
@InputType('ConsultationPortalAdviceRequestInput')
export class AdviceRequest {
  @Field(() => String, { nullable: true })
  content?: string | null

  @Field(() => [AdviceFileRequest], { nullable: true })
  adviceFiles?: AdviceFileRequest[] | null
}
