import { Field, ObjectType } from '@nestjs/graphql'
import { AppointmentCancelOutcomeEnum } from './enums'

@ObjectType('HealthDirectorateCancelAppointmentResponse')
export class CancelAppointmentResponse {
  @Field(() => AppointmentCancelOutcomeEnum)
  outcome!: AppointmentCancelOutcomeEnum
}
