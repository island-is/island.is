import { Field, ObjectType } from '@nestjs/graphql'
import { CommunicationBase } from './communicationBase.model'
import { CommunicationKindEnum } from './enums'

@ObjectType('HealthDirectoratePregnancyCommunication')
export class Communication extends CommunicationBase {
  @Field(() => CommunicationKindEnum)
  kind!: CommunicationKindEnum
}
