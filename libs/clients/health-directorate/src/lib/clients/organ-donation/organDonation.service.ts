import { AuthMiddleware, Auth } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { Inject, Injectable } from '@nestjs/common'
import {
  DonationExceptionsApi,
  Locale,
  MeOrganDonorStatusApi,
  OrganDonorDto,
  OrganDto,
  UpdateOrganDonorDto,
} from './gen/fetch'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

const LOG_CATEGORY = 'health-directorate-organ-donation-api'
@Injectable()
export class HealthDirectorateOrganDonationService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly organDonationApi: MeOrganDonorStatusApi,
    private readonly donationExceptionsApi: DonationExceptionsApi,
  ) {}

  private organDonationApiWithAuth(auth: Auth) {
    return this.organDonationApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async getOrganDonation(
    auth: Auth,
    input: Locale,
  ): Promise<OrganDonorDto | null> {
    const organDonation = await this.organDonationApiWithAuth(auth)
      .meDonorStatusControllerGetOrganDonorStatus({ locale: input })
      .catch(handle404)

    if (!organDonation) {
      this.logger.warn('No organ donations data returned', {
        category: LOG_CATEGORY,
      })
      return null
    }

    return organDonation
  }

  public async updateOrganDonation(
    auth: Auth,
    input: UpdateOrganDonorDto,
    locale: Locale,
  ): Promise<void> {
    await this.organDonationApiWithAuth(
      auth,
    ).meDonorStatusControllerUpdateOrganDonorStatus({
      updateOrganDonorDto: input,
      locale: locale,
    })
  }

  public async getDonationExceptions(
    auth: Auth,
    input: Locale,
  ): Promise<Array<OrganDto> | null> {
    const donationExceptions = await this.donationExceptionsApi
      .withMiddleware(new AuthMiddleware(auth))
      .donationExceptionControllerGetOrgans({ locale: input })
      .catch(handle404)

    if (!donationExceptions) {
      this.logger.warn('No organ donations exceptions returned', {
        category: LOG_CATEGORY,
      })
      return null
    }

    return donationExceptions
  }
}
