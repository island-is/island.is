import { Field, ObjectType, Int, GraphQLISODateTime, ID } from '@nestjs/graphql'
import {
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

  @Field(() => [AppointmentAssignee])
  assignees!: AppointmentAssignee[]

  @Field(() => [AppointmentLink], { nullable: true })
  links?: AppointmentLink[]

  @Field(() => Int, { nullable: true, description: 'Duration in minutes' })
  duration?: number
}
