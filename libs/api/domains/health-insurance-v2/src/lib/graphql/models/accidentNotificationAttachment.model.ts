import { Field, ObjectType } from '@nestjs/graphql'

export enum AttachmentTypes {
  INJURY_CERTIFICATE = 'InjuryCertificate',
  PROXY_DOCUMENT = 'ProxyDocument',
  POLICE_REPORT = 'PoliceReport',
}

@ObjectType()
export class AccidentNotificationAttachment {
  @Field({ nullable: true })
  InjuryCertificate?: boolean
  @Field({ nullable: true })
  ProxyDocument?: boolean
  @Field({ nullable: true })
  PoliceReport?: boolean
  @Field({ nullable: true })
  Unknown?: boolean
}
