import { Field, ObjectType } from '@nestjs/graphql'
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
