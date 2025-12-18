import { HealthDirectorateAppointmentStatus } from '@island.is/api/schema'

export const PHYSIO_THERAPY = 'physio'
export const PHYSIO_ACCIDENT_THERAPY = 'accident'
export const PHYSIO_HOME_THERAPY = 'home'
export const SPEECH_THERAPY = 'speech'
export const OCCUPATIONAL_THERAPY = 'occupational'
// TODO: Decide an ID for "Ljósböð" therapy and talk to Sjúkratryggingar (fasi 2)

export enum TherapyStatus {
  ALM = 'ALM',
  BARN = 'BARN',
  BU12 = 'BU12',
  BA02 = 'BA02',
  ELLI = 'ELLI',
  UM12 = 'UM12',
  UM18 = 'UM18',
  LSTT = 'LSTT',
  LOTT = 'LOTT',
  OR = 'OR',
}
export const SECTION_GAP = 5
export const CONTENT_GAP = 2
export const CONTENT_GAP_LG = 3
export const CONTENT_GAP_SM = 1
export const DATE_FORMAT = 'dd.MM.yyyy'
export const DATE_FORMAT_SHORT = 'd.M.yyyy'

export const ATC_URL_BASE = 'https://www.serlyfjaskra.is/atc?category='

export const DEFAULT_APPOINTMENTS_STATUS = [
  HealthDirectorateAppointmentStatus.BOOKED,
  HealthDirectorateAppointmentStatus.CANCELLED,
  HealthDirectorateAppointmentStatus.PENDING,
]
