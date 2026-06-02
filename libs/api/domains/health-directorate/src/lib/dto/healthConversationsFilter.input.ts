import { Field, InputType } from '@nestjs/graphql'
import { HealthConversationStatusFilterEnum } from '../models/enums'

@InputType()
export class HealthDirectorateHealthConversationsFilterInput {
  @Field(() => HealthConversationStatusFilterEnum, { nullable: true })
  status?: HealthConversationStatusFilterEnum

  @Field(() => Boolean, { nullable: true })
  starred?: boolean
}
