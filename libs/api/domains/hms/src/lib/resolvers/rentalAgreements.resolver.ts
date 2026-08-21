import { Query, Resolver, Args, ID } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
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
import { AGREEMENT_STATUS_ORDER } from '../constants'
import { mapToRentalAgreement } from '../mappers'
import { handle404 } from '@island.is/clients/middlewares'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { DownloadServiceConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/hms' })
@FeatureFlag(Features.isServicePortalMyContractsPageEnabled)
export class RentalAgreementsResolver {
  constructor(
    private service: HmsRentalAgreementService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  @Query(() => PaginatedRentalAgreementCollection, {
    name: 'hmsRentalAgreements',
  })
  @Audit()
  async getRentalAgreements(
    @CurrentUser() user: User,
    @Args('hideInactiveAgreements', { nullable: true })
    hideInactiveAgreements?: boolean,
  ): Promise<PaginatedRentalAgreementCollection> {
    const dtos = await this.service.getRentalAgreements(
      user,
      hideInactiveAgreements,
    )
    const data = dtos
      .map(mapToRentalAgreement)
      .sort(
        (a, b) =>
          AGREEMENT_STATUS_ORDER.indexOf(a.status) -
          AGREEMENT_STATUS_ORDER.indexOf(b.status),
      )

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
    @Args('contractId', { type: () => ID }) contractId: string,
  ): Promise<RentalAgreement | undefined> {
    const dto = await this.service
      .getRentalAgreement(user, contractId)
      .catch(handle404)

    if (!dto) return undefined

    const mapped = mapToRentalAgreement(dto)
    const baseUrl = `${this.downloadServiceConfig.baseUrl}/download/v1/rental-agreements/${contractId}`

    return {
      ...mapped,
      latestDocumentDownloadUrl: dto.infoAvailable ? baseUrl : undefined,
      documents: mapped.documents?.map((doc) => ({
        ...doc,
        downloadUrl: `${baseUrl}/${doc.id}`,
      })),
    }
  }
}
