import { Field, ObjectType } from '@nestjs/graphql'
import { IsEnum } from 'class-validator'
import { HealthInsuranceAccidentNotificationAttachmentTypes } from '../../types'

@ObjectType()
export class AccidentNotificationAttachment {
  @Field(() => Boolean)
  isReceived?: boolean

  @Field(() => HealthInsuranceAccidentNotificationAttachmentTypes)
  @IsEnum(HealthInsuranceAccidentNotificationAttachmentTypes)
  attachmentType?: HealthInsuranceAccidentNotificationAttachmentTypes
}
