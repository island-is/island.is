import { Field, ObjectType, Float } from '@nestjs/graphql'

@ObjectType('HealthDirectorateAppointmentLocation')
export class AppointmentLocation {
  @Field()
  id!: string

  @Field()
  name!: string

  @Field()
  organization!: string

  @Field()
  address!: string

  @Field()
  directions!: string

  @Field()
  city!: string

  @Field()
  postalCode!: string

  @Field({ nullable: true })
  country?: string

  @Field(() => Float)
  latitude!: number

  @Field(() => Float)
  longitude!: number
}

@ObjectType('HealthDirectorateAppointment')
export class Appointment {
  @Field()
  id!: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  date?: string

  @Field({ nullable: true })
  time?: string

  @Field({ nullable: true })
  weekday?: string

  @Field()
  status!: string

  @Field({ nullable: true })
  instruction?: string

  @Field(() => AppointmentLocation, { nullable: true })
  location?: AppointmentLocation

  @Field(() => [String])
  practitioners!: string[]
}

@ObjectType('HealthDirectorateAppointments')
export class Appointments {
  @Field(() => [Appointment], { nullable: true })
  data?: Appointment[]
}
