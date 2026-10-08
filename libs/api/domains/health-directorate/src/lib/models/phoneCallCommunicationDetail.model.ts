import { Field, ObjectType } from '@nestjs/graphql'
import { PregnancyCommunicationAuthor } from './pregnancyCommunicationAuthor.model'
import { PregnancyCommunicationBase } from './pregnancyCommunicationBase.model'
import { PregnancyCommunicationKindEnum } from './enums'

@ObjectType('HealthDirectoratePregnancyPhoneCallDetail')
export class PhoneCallCommunicationDetail extends PregnancyCommunicationBase {
  kind!: PregnancyCommunicationKindEnum.phoneCall

  @Field(() => PregnancyCommunicationAuthor, { nullable: true })
  registeredBy?: PregnancyCommunicationAuthor
}
