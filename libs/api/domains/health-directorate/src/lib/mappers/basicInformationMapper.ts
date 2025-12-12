import {
  AppointmentStatus,
  DiseaseVaccinationDtoVaccinationStatusEnum,
} from '@island.is/clients/health-directorate'
import { AppointmentStatusEnum, VaccinationStatusEnum } from '../models/enums'

export const mapVaccinationStatus = (
  status?: DiseaseVaccinationDtoVaccinationStatusEnum,
): VaccinationStatusEnum => {
  switch (status) {
    case DiseaseVaccinationDtoVaccinationStatusEnum.Valid:
      return VaccinationStatusEnum.valid
    case DiseaseVaccinationDtoVaccinationStatusEnum.Complete:
      return VaccinationStatusEnum.complete
    case DiseaseVaccinationDtoVaccinationStatusEnum.Expired:
      return VaccinationStatusEnum.expired
    case DiseaseVaccinationDtoVaccinationStatusEnum.Incomplete:
      return VaccinationStatusEnum.incomplete
    case DiseaseVaccinationDtoVaccinationStatusEnum.Rejected:
      return VaccinationStatusEnum.rejected
    case DiseaseVaccinationDtoVaccinationStatusEnum.Undetermined:
      return VaccinationStatusEnum.undetermined
    case DiseaseVaccinationDtoVaccinationStatusEnum.Undocumented:
      return VaccinationStatusEnum.undocumented
    case DiseaseVaccinationDtoVaccinationStatusEnum.Unvaccinated:
      return VaccinationStatusEnum.unvaccinated
    default:
      return VaccinationStatusEnum.undetermined
  }
}

export const mapAppointmentStatus = (
  status: AppointmentStatusEnum,
): AppointmentStatus | null => {
  switch (status) {
    case AppointmentStatusEnum.BOOKED:
      return AppointmentStatus.BOOKED
    case AppointmentStatusEnum.PENDING:
      return AppointmentStatus.PENDING
    case AppointmentStatusEnum.PROPOSED:
      return AppointmentStatus.PROPOSED
    case AppointmentStatusEnum.CANCELLED:
      return AppointmentStatus.CANCELLED
    case AppointmentStatusEnum.FULFILLED:
      return AppointmentStatus.FULFILLED
    case AppointmentStatusEnum.ARRIVED:
      return AppointmentStatus.ARRIVED
    case AppointmentStatusEnum.NOSHOW:
      return AppointmentStatus.NOSHOW
    case AppointmentStatusEnum.ENTERED_IN_ERROR:
      return AppointmentStatus.ENTERED_IN_ERROR
    case AppointmentStatusEnum.WAITLIST:
      return AppointmentStatus.WAITLIST
    case AppointmentStatusEnum.DELETED:
      return AppointmentStatus.DELETED
    default:
      return null
  }
}
