import { Field, ObjectType, Float, Int } from '@nestjs/graphql'

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

  @Field({ nullable: true })
  date?: string

  @Field()
  status!: string

  @Field({ nullable: true })
  instruction?: string

  @Field(() => AppointmentLocation, { nullable: true })
  location?: AppointmentLocation

  @Field(() => [String])
  practitioners!: string[]

  @Field(() => Int, { nullable: true })
  duration?: number
}

@ObjectType('HealthDirectorateAppointments')
export class Appointments {
  @Field(() => [Appointment], { nullable: true })
  data?: Appointment[]
}
