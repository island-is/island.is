import { Field, ObjectType, Float, Int, GraphQLISODateTime } from '@nestjs/graphql'
import { AppointmentStatusEnum } from './enums'

@ObjectType('HealthDirectorateAppointmentLocation')
export class AppointmentLocation {
  @Field()
  name!: string

  @Field({ nullable: true })
  organization?: string

  @Field()
  address!: string

  @Field({ nullable: true })
  directions?: string

  @Field({ nullable: true })
  city?: string

  @Field({ nullable: true })
  postalCode?: string

  @Field({ nullable: true })
  country?: string

  @Field(() => Float, { nullable: true })
  latitude?: number

  @Field(() => Float, { nullable: true })
  longitude?: number
}

@ObjectType('HealthDirectorateAppointment')
export class Appointment {
  @Field()
  id!: string

  @Field({ nullable: true })
  title?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  date?: Date

  @Field(() => AppointmentStatusEnum, { nullable: true })
  status?: AppointmentStatusEnum

  @Field(() => AppointmentLocation, { nullable: true })
  location?: AppointmentLocation

  @Field(() => Int, { nullable: true, description: 'Duration in minutes' })
  duration?: number

  @Field({ nullable: true, deprecationReason: 'Use healthDirectorateAppointment query for full appointment details' })
  instruction?: string

  @Field(() => [String], { deprecationReason: 'Use healthDirectorateAppointment query for full appointment details' })
  practitioners!: string[]
}

@ObjectType('HealthDirectorateAppointments')
export class Appointments {
  @Field(() => [Appointment], { nullable: true })
  data?: Appointment[]
}
