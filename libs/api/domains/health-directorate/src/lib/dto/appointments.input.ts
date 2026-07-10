import { ArgsType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql'
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'
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

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  pageSize?: number
}

@ArgsType()
export class HealthDirectorateAppointmentInput {
  @Field()
  @IsString()
  id!: string
}
