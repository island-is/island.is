import { Field, ObjectType } from '@nestjs/graphql'
import { HealthCenterRecord } from './healthCenterRecord.model'

@ObjectType('RightsPortalHealthCenterRegistrationHistory')
export class HealthCenterRegistrationHistory {
  @Field(() => HealthCenterRecord, { nullable: true })
  current?: HealthCenterRecord

  @Field(() => [HealthCenterRecord], { nullable: true })
  history?: Array<HealthCenterRecord>

  @Field(() => Boolean, { nullable: true })
  canRegister?: boolean
}
