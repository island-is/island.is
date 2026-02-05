import {
  DiseaseVaccinationDtoVaccinationStatusEnum,
  UserVisibleAppointmentStatuses,
} from '@island.is/clients/health-directorate'
import {
  AppointmentStatusEnum,
  VaccinationStatusEnum,
  WaitlistStatusTagColorEnum,
  ReferralStatusEnum,
} from '../models/enums'

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
): UserVisibleAppointmentStatuses | null => {
  switch (status) {
    case AppointmentStatusEnum.BOOKED:
      return UserVisibleAppointmentStatuses.BOOKED
    case AppointmentStatusEnum.CANCELLED:
      return UserVisibleAppointmentStatuses.CANCELLED
    case AppointmentStatusEnum.FULFILLED:
      return UserVisibleAppointmentStatuses.FULFILLED
    case AppointmentStatusEnum.ARRIVED:
      return UserVisibleAppointmentStatuses.ARRIVED
    case AppointmentStatusEnum.CHECKED_IN:
      return UserVisibleAppointmentStatuses.CHECKED_IN
    default:
      return null
  }
}

export const mapStatusIdToColor = (
  statusId?: number | null,
): WaitlistStatusTagColorEnum => {
  switch (statusId) {
    case 10:
      return WaitlistStatusTagColorEnum.blue
    case 20:
    case 100:
      return WaitlistStatusTagColorEnum.red
    case 30:
    case 40:
    case 50:
    case 60:
    case 70:
    case 110:
      return WaitlistStatusTagColorEnum.mint
    case 80:
    case 90:
      return WaitlistStatusTagColorEnum.purple
    default:
      return WaitlistStatusTagColorEnum.blue
  }
}

export const mapReferralStatusValueToStatus = (
  statusValue?: number | null,
): ReferralStatusEnum => {
  switch (statusValue) {
    case 0:
      return ReferralStatusEnum.Open
    case 10:
      return ReferralStatusEnum.Withdrawn
    case 20:
      return ReferralStatusEnum.InTreatment
    case 30:
      return ReferralStatusEnum.Completed
    case 50:
      return ReferralStatusEnum.Rejected
    case 60:
      return ReferralStatusEnum.Finished
    case 98:
      return ReferralStatusEnum.Deleted
    case 99:
      return ReferralStatusEnum.Expired
    default: // Should not happen unless a new status is added without letting us know
      return ReferralStatusEnum.Unknown
  }
}
