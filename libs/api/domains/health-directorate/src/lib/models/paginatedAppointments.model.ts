import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { Appointment } from './appointments.model'

@ObjectType('HealthDirectoratePaginatedAppointments')
export class HealthDirectoratePaginatedAppointments extends PaginatedResponse(
  Appointment,
) {}
