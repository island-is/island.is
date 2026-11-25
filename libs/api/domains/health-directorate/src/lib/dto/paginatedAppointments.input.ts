import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql'
import { IsDate, IsEnum, IsOptional } from 'class-validator'
import { PaginationInput } from '@island.is/nest/pagination'
import { AppointmentStatusEnum, AppointmentsOrderEnum } from '../models/enums'

@InputType()
export class HealthDirectoratePaginatedAppointmentsInput extends PaginationInput() {
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
}
