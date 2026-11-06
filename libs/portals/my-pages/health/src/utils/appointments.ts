import {
  HealthDirectorateAppointmentStatus,
  HealthDirectorateAppointmentsOrder,
  HealthDirectoratePaginatedAppointmentsInput,
} from '@island.is/api/schema'
import { VISIBLE_APPOINTMENTS_STATUS } from './constants'

export const getStartOfToday = () => {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  return startOfToday
}

export const nextAppointmentsInput = (
  limit: number,
): HealthDirectoratePaginatedAppointmentsInput => ({
  from: getStartOfToday(),
  status: VISIBLE_APPOINTMENTS_STATUS,
  order: HealthDirectorateAppointmentsOrder.ASC,
  limit,
})

export const isPastAppointment = (
  appointment?: {
    status?: HealthDirectorateAppointmentStatus | null
    date?: string | Date | null
  } | null,
) =>
  !!appointment?.status &&
  VISIBLE_APPOINTMENTS_STATUS.includes(appointment.status) &&
  !!appointment.date &&
  new Date(appointment.date) < getStartOfToday()
