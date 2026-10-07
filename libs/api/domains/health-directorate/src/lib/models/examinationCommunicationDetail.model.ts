import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { CommunicationAuthor } from './communicationAuthor.model'
import { CommunicationBase } from './communicationBase.model'
import { CommunicationKindEnum } from './enums'
import { FetalHeartRate } from './fetalHeartRate.model'

@ObjectType('HealthDirectoratePregnancyExaminationDetail')
export class ExaminationCommunicationDetail extends CommunicationBase {
  kind!: CommunicationKindEnum.examination

  @Field(() => CommunicationAuthor, { nullable: true })
  registeredBy?: CommunicationAuthor

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

  @Field({
    nullable: true,
    description:
      'Source mixes label strings ("Neikvætt") and comma-decimal entries ("1,0 ++") — exposed as raw string.',
  })
  albumenInUrineScore?: string

  @Field(() => Float, { nullable: true })
  fundalHeight?: number

  @Field(() => [FetalHeartRate])
  fetalHeartRates!: FetalHeartRate[]
}
