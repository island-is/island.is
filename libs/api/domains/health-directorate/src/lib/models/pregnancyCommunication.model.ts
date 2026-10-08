import { Field, ObjectType } from '@nestjs/graphql'
import { PregnancyCommunicationBase } from './pregnancyCommunicationBase.model'
import { PregnancyCommunicationKindEnum } from './enums'

@ObjectType('HealthDirectoratePregnancyCommunication')
export class PregnancyCommunication extends PregnancyCommunicationBase {
  @Field(() => PregnancyCommunicationKindEnum)
  kind!: PregnancyCommunicationKindEnum
}
