import { Advert, AdvertDepartment, AdvertStatus } from './models/advert.model'

// This is a 1to1 mapping of the enum values from libs/clients/dmr/gen/fetch/models/JournalAdvert.ts -> JournalAdvertDepartmentEnum
export const mapAdvertDepartment = (department?: string) => {
  if (!department) return AdvertDepartment.Unknown

  switch (department) {
    case 'A deild':
      return AdvertDepartment.ADeild
    case 'B deild':
      return AdvertDepartment.BDeild
    case 'C deild':
      return AdvertDepartment.CDeild
    default:
      return AdvertDepartment.Unknown
  }
}

// This is a 1to1 mapping of the enum values from libs/clients/dmr/gen/fetch/models/JournalAdvert.ts -> JournalAdvertStatusEnum
export const mapAdvertStatus = (status?: string) => {
  if (!status) return AdvertStatus.Unknown

  switch (status) {
    case 'Virk':
      return AdvertStatus.Active
    case 'Afturkölluð':
      return AdvertStatus.Revoked
    case 'Drög':
      return AdvertStatus.Draft
    case 'Eldri auglýsing':
      return AdvertStatus.Old
    case 'Hafnað':
      return AdvertStatus.Rejected
    case 'Í bið':
      return AdvertStatus.Waiting
    case 'Í vinnslu':
      return AdvertStatus.InProgress
    case 'Innsend':
      return AdvertStatus.Submitted
    case 'Tilbúin til útgáfu':
      return AdvertStatus.ReadyForPublication
    case 'Útgefin':
      return AdvertStatus.Published
    default:
      return AdvertStatus.Unknown
  }
}
