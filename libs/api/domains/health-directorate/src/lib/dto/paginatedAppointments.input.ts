import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql'
import {
  IsDate,
  IsEmpty,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator'
import { AppointmentStatusEnum, AppointmentsOrderEnum } from '../models/enums'

@InputType()
export class HealthDirectoratePaginatedAppointmentsInput {
  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsDate()
  @IsOptional()
  from?: Date

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Exclusive.',
  })
  @IsDate()
  @IsOptional()
  to?: Date

  @Field(() => [AppointmentStatusEnum], { nullable: true })
  @IsEnum(AppointmentStatusEnum, { each: true })
  @IsOptional()
  status?: AppointmentStatusEnum[]

  @Field(() => AppointmentsOrderEnum, { nullable: true })
  @IsEnum(AppointmentsOrderEnum)
  @IsOptional()
  order?: AppointmentsOrderEnum

  @Field(() => Int, {
    nullable: true,
    defaultValue: 20,
    description: '1-100.',
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number

  @Field({ nullable: true, description: 'Not combinable with before.' })
  @IsString()
  @IsOptional()
  after?: string

  @Field({ nullable: true, description: 'Not combinable with after.' })
  @ValidateIf((input) => input.after != null && input.after !== '')
  @IsEmpty({ message: 'before cannot be combined with after' })
  @IsOptional()
  before?: string
}
