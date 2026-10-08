import {
  Field,
  Float,
  GraphQLISODateTime,
  ID,
  InterfaceType,
  Int,
  ObjectType,
} from '@nestjs/graphql'
import { PregnancyCommunicationAuthor } from './pregnancyCommunicationAuthor.model'
import { PregnancyCommunicationKindEnum } from './enums'
import { FetalHeartRate } from './fetalHeartRate.model'

@InterfaceType('HealthDirectoratePregnancyCommunicationDetail', {
  resolveType: (value: PregnancyCommunicationDetail) => {
    switch (value.kind) {
      case PregnancyCommunicationKindEnum.examination:
        return ExaminationCommunicationDetail
      case PregnancyCommunicationKindEnum.phoneCall:
        return PhoneCallCommunicationDetail
      default:
        return undefined
    }
  },
})
export abstract class PregnancyCommunicationDetail {
  abstract kind: PregnancyCommunicationKindEnum

  @Field(() => ID)
  id!: string

  @Field(() => Int, { nullable: true })
  weeks?: number

  @Field(() => Int, { nullable: true })
  days?: number

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateTime?: Date

  @Field({ nullable: true })
  text?: string

  @Field({ nullable: true })
  authorName?: string

  @Field({ nullable: true })
  subject?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  lastUpdated?: Date

  @Field(() => PregnancyCommunicationAuthor, { nullable: true })
  registeredBy?: PregnancyCommunicationAuthor
}

@ObjectType('HealthDirectoratePregnancyExaminationDetail', {
  implements: PregnancyCommunicationDetail,
})
export class ExaminationCommunicationDetail extends PregnancyCommunicationDetail {
  kind!: PregnancyCommunicationKindEnum.examination

  @Field(() => Float, { nullable: true })
  weight?: number

  @Field(() => Int, { nullable: true })
  pulse?: number

  @Field(() => Int, { nullable: true })
  bloodPressureUpper?: number

  @Field(() => Int, { nullable: true })
  bloodPressureLower?: number

  @Field(() => Float, { nullable: true })
  hemoglobin?: number

  @Field({ nullable: true })
  albumenInUrineScore?: string

  @Field(() => Float, { nullable: true })
  fundalHeight?: number

  @Field(() => [FetalHeartRate])
  fetalHeartRates!: FetalHeartRate[]
}

@ObjectType('HealthDirectoratePregnancyPhoneCallDetail', {
  implements: PregnancyCommunicationDetail,
})
export class PhoneCallCommunicationDetail extends PregnancyCommunicationDetail {
  kind!: PregnancyCommunicationKindEnum.phoneCall
}
