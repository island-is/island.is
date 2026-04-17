import { Field, ObjectType, Int, GraphQLISODateTime } from '@nestjs/graphql'
import { AppointmentStatusEnum } from './enums'
import { AppointmentLocation } from './appointments.model'

@ObjectType('HealthDirectorateAppointmentDetail')
export class AppointmentDetail {
  @Field()
  id!: string

  @Field({ nullable: true })
  title?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  date?: Date

  @Field(() => AppointmentStatusEnum, { nullable: true })
  status?: AppointmentStatusEnum

  @Field({ nullable: true, description: 'Patient preparation instructions for the appointment' })
  instruction?: string

  @Field(() => AppointmentLocation, { nullable: true })
  location?: AppointmentLocation

  @Field(() => [String], { description: 'Names of practitioners assigned to the appointment' })
  practitioners!: string[]

  @Field(() => Int, { nullable: true, description: 'Duration in minutes' })
  duration?: number
}
