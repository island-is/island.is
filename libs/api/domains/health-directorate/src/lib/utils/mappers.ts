import { DiseaseVaccinationDtoVaccinationStatusEnum } from '@island.is/clients/health-directorate'
import { VaccinationStatusEnum } from '../models/enums'

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
