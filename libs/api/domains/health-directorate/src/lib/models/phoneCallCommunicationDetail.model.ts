import { Field, ObjectType } from '@nestjs/graphql'
import { CommunicationAuthor } from './communicationAuthor.model'
import { CommunicationBase } from './communicationBase.model'
import { CommunicationKindEnum } from './enums'

@ObjectType('HealthDirectoratePregnancyPhoneCallDetail')
export class PhoneCallCommunicationDetail extends CommunicationBase {
  kind!: CommunicationKindEnum.phoneCall

  @Field(() => CommunicationAuthor, { nullable: true })
  registeredBy?: CommunicationAuthor
}
