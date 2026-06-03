import {
  Field,
  ObjectType,
  Float,
  Int,
  GraphQLISODateTime,
} from '@nestjs/graphql'
import {
  AppointmentStatusEnum,
  AppointmentModalityEnum,
  AppointmentAssigneeTypeEnum,
  AppointmentLinkTypeEnum,
} from './enums'

@ObjectType('HealthDirectorateAppointmentLocationLink')
export class AppointmentLocationLink {
  @Field()
  type!: string

  @Field()
  url!: string
}

@ObjectType('HealthDirectorateAppointmentLocation')
export class AppointmentLocation {
  @Field()
  name!: string

  @Field({ nullable: true })
  organization?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  department?: string

  @Field({ nullable: true })
  wing?: string

  @Field({ nullable: true })
  floor?: string

  @Field({ nullable: true })
  room?: string

  @Field({ nullable: true })
  directions?: string

  @Field({ nullable: true })
  city?: string

  @Field({ nullable: true })
  postalCode?: string

  @Field({ nullable: true })
  country?: string

  @Field({ nullable: true })
  link?: string

  @Field(() => Float, { nullable: true })
  latitude?: number

  @Field(() => Float, { nullable: true })
  longitude?: number

  @Field({ nullable: true })
  phoneNumber?: string

  @Field({ nullable: true })
  openingHoursText?: string

  @Field(() => [AppointmentLocationLink], { nullable: true })
  locationLinks?: AppointmentLocationLink[]
}

@ObjectType('HealthDirectorateAppointmentAssignee')
export class AppointmentAssignee {
  @Field(() => AppointmentAssigneeTypeEnum)
  type!: AppointmentAssigneeTypeEnum

  @Field()
  name!: string
}

@ObjectType('HealthDirectorateAppointmentLink')
export class AppointmentLink {
  @Field(() => AppointmentLinkTypeEnum)
  type!: AppointmentLinkTypeEnum

  @Field()
  url!: string
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

  @Field(() => AppointmentModalityEnum, { nullable: true })
  modality?: AppointmentModalityEnum

  @Field(() => AppointmentLocation, { nullable: true })
  location?: AppointmentLocation

  @Field(() => Int, { nullable: true, description: 'Duration in minutes' })
  duration?: number

  @Field({ nullable: true })
  instruction?: string

  @Field(() => [String])
  practitioners!: string[]

  @Field(() => [AppointmentAssignee])
  assignees!: AppointmentAssignee[]
}

@ObjectType('HealthDirectorateAppointments')
export class Appointments {
  @Field(() => [Appointment], { nullable: true })
  data?: Appointment[]
}
