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
  date?: string

  @Field(() => AppointmentStatusEnum)
  status!: AppointmentStatusEnum

  @Field({ nullable: true })
  instruction?: string

  @Field(() => AppointmentLocation, { nullable: true })
  location?: AppointmentLocation

  @Field(() => [String])
  practitioners!: string[]

  @Field(() => Int, { nullable: true, description: 'Duration in minutes' })
  duration?: number
}
