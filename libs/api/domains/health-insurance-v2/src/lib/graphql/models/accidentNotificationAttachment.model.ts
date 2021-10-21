import { Field, ObjectType } from '@nestjs/graphql'
import { IsEnum } from 'class-validator'

export enum AttachmentTypes {
  INJURY_CERTIFICATE = 'InjuryCertificate',
  PROXY_DOCUMENT = 'ProxyDocument',
  POLICE_REPORT = 'PoliceReport',
}

@ObjectType()
export class AccidentNotificationAttachment {
  @Field(() => Boolean)
  isReceived?: boolean

  // 1 = Áverkavottorð, 2 = Umboðsskjal, 3 = Lögregluskýrsla
  @Field(() => String)
  @IsEnum(AttachmentTypes)
  attachmentType?: string
}
