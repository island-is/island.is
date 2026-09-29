import { RentalAgreementDto } from './rentalAgreement.dto'

export interface RentalAgreementsDto {
  data: RentalAgreementDto[]
  totalCount: number
  page?: number
  pageSize?: number
}
