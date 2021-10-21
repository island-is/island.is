import { Field, ObjectType } from '@nestjs/graphql'
import { AccidentNotificationAttachment } from './accidentNotificationAttachment.model'
import { AccidentNotificationConfirmation } from './accidentNotificationConfirmation.model'
import { IsEnum } from 'class-validator'

export enum StatusTypes {
  ACCEPTED = 'Accepted',
  REFUSED = 'Refused',
  INPROGRESS = 'InProgress',
  INPROGRESSWAITINGFORDOCUMENT = 'InProgressWaitingForAttachment',
}

@ObjectType()
export class AccidentNotificationStatus {
  @Field(() => Number)
  numberIHI?: number

  @Field(() => String)
  @IsEnum(StatusTypes)
  status?: string

  @Field(() => [AccidentNotificationAttachment], { nullable: true })
  attachments?: AccidentNotificationAttachment[]

  @Field(() => [AccidentNotificationConfirmation])
  confirmations?: AccidentNotificationConfirmation[]
}
