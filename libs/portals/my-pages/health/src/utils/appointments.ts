import { HealthDirectorateAppointmentStatus } from '@island.is/api/schema'
import { PAST_APPOINTMENTS_STATUS } from './constants'

// BOOKED appointments count as past from the day after their date — the
// upcoming query includes all of today (its "from" defaults to start of
// today server-side), so flipping earlier would list them in both tabs
export const isPastAppointment = (
  appointment?: {
    status?: HealthDirectorateAppointmentStatus | null
    date?: string | Date | null
  } | null,
) => {
  if (!appointment?.status) {
    return false
  }
  if (appointment.status !== HealthDirectorateAppointmentStatus.BOOKED) {
    return PAST_APPOINTMENTS_STATUS.includes(appointment.status)
  }
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  return !!appointment.date && new Date(appointment.date) < startOfToday
}
