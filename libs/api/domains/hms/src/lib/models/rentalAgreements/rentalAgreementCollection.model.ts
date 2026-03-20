import { ObjectType } from '@nestjs/graphql'
import { RentalAgreement } from './rentalAgreement.model'
import { PaginatedResponse } from '@island.is/nest/pagination'

@ObjectType('HmsPaginatedRentalAgreementCollection')
export class PaginatedRentalAgreementCollection extends PaginatedResponse(
  RentalAgreement,
) {}
