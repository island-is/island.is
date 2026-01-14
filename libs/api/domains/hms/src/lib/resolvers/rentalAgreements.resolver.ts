import { Query, Resolver, Args, ID } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  type User,
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { PaginatedRentalAgreementCollection } from '../models/rentalAgreements/rentalAgreementCollection.model'
import { HmsRentalAgreementService } from '@island.is/clients/hms-rental-agreement'
import { RentalAgreement } from '../models/rentalAgreements/rentalAgreement.model'
import { mapToRentalAgreement } from '../mappers'
import { handle404 } from '@island.is/clients/middlewares'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/hms' })
export class RentalAgreementsResolver {
  constructor(private service: HmsRentalAgreementService) {}

  @Query(() => PaginatedRentalAgreementCollection, {
    name: 'hmsRentalAgreements',
  })
  @Audit()
  async getRentalAgreements(
    @CurrentUser() user: User,
  ): Promise<PaginatedRentalAgreementCollection> {
    const res = await this.service.getRentalAgreements(user)
    const data = res.map(mapToRentalAgreement)

    return {
      data,
      totalCount: data.length,
      pageInfo: {
        hasNextPage: false,
      },
    }
  }

  @Query(() => RentalAgreement, {
    name: 'hmsRentalAgreement',
    nullable: true,
  })
  @Audit()
  async getRentalAgreement(
    @CurrentUser() user: User,
    @Args('contractId', { type: () => ID }) contractId: number,
  ): Promise<RentalAgreement | undefined> {
    const data = await this.service
      .getRentalAgreement(user, contractId)
      .catch(handle404)

    return data ? mapToRentalAgreement(data) : undefined
  }
}
