import { AdvertStatus } from './models/advert.model'
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
