import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { PregnancyCommunicationAuthor } from './pregnancyCommunicationAuthor.model'
import { PregnancyCommunicationBase } from './pregnancyCommunicationBase.model'
import { PregnancyCommunicationKindEnum } from './enums'
import { FetalHeartRate } from './fetalHeartRate.model'

@ObjectType('HealthDirectoratePregnancyExaminationDetail')
export class ExaminationCommunicationDetail extends PregnancyCommunicationBase {
  kind!: PregnancyCommunicationKindEnum.examination

  @Field(() => PregnancyCommunicationAuthor, { nullable: true })
  registeredBy?: PregnancyCommunicationAuthor

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
