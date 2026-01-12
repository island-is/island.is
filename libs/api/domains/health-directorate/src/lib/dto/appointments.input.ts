import { ArgsType, Field, GraphQLISODateTime } from '@nestjs/graphql'
import { IsDate, IsEnum, IsOptional } from 'class-validator'
import { AppointmentStatusEnum } from '../models/enums'

@ArgsType()
export class HealthDirectorateAppointmentsInput {
  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsDate({ always: false })
  @IsOptional()
  from?: Date

  @Field(() => [AppointmentStatusEnum], { nullable: true })
  @IsEnum(AppointmentStatusEnum, { each: true, always: false })
  @IsOptional()
  status?: AppointmentStatusEnum[]
}
