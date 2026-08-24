import { Field, ObjectType, Int, GraphQLISODateTime, ID } from '@nestjs/graphql'
import {
  AppointmentCancelBlockedReasonEnum,
  AppointmentStatusEnum,
  AppointmentModalityEnum,
} from './enums'
import {
  AppointmentLocation,
  AppointmentAssignee,
  AppointmentLink,
} from './appointments.model'

@ObjectType('HealthDirectorateAppointmentDetail')
export class AppointmentDetail {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  title?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  date?: Date

  @Field(() => AppointmentStatusEnum, { nullable: true })
  status?: AppointmentStatusEnum

  @Field(() => AppointmentModalityEnum, { nullable: true })
  modality?: AppointmentModalityEnum

  @Field({
    nullable: true,
    description: 'Patient preparation instructions for the appointment',
  })
  instruction?: string

  @Field(() => AppointmentLocation, { nullable: true })
  location?: AppointmentLocation

  @Field(() => [String], {
    description: 'Names of practitioners assigned to the appointment',
  })
  practitioners!: string[]

  @Field(() => [AppointmentAssignee], { nullable: true })
  assignees?: AppointmentAssignee[]

  @Field(() => [AppointmentLink], { nullable: true })
  links?: AppointmentLink[]

  @Field(() => Int, { nullable: true, description: 'Duration in minutes' })
  duration?: number

  @Field({
    description: 'Whether the patient may request cancellation right now',
  })
  canCancel!: boolean

  @Field(() => AppointmentCancelBlockedReasonEnum, {
    nullable: true,
    description: 'Reason cancellation is blocked; only set when canCancel is false',
  })
  cancelBlockedReason?: AppointmentCancelBlockedReasonEnum
}
