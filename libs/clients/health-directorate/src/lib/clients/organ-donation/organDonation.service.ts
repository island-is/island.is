import { AuthMiddleware, Auth } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { Inject, Injectable } from '@nestjs/common'
import {
  DonationExceptionsApi,
  Locale,
  MeDonorStatusApi,
  OrganDonorDto,
  OrganDto,
} from './gen/fetch'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

const LOG_CATEGORY = 'health-directorate-organ-donation-api'
@Injectable()
export class HealthDirectorateOrganDonationService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly organDonationApi: MeDonorStatusApi,
    private readonly donationExceptionsApi: DonationExceptionsApi,
  ) {}

  private organDonationApiWithAuth(auth: Auth) {
    return this.organDonationApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async getOrganDonation(auth: Auth): Promise<OrganDonorDto | null> {
    const organDonation = await this.organDonationApiWithAuth(auth)
      .meDonorStatusControllerGetOrganDonorStatus()
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
    input: OrganDonorDto,
  ): Promise<void> {
    await this.organDonationApiWithAuth(auth)
      .meDonorStatusControllerUpdateOrganDonorStatus({
        updateOrganDonorDto: input,
      })
      .catch((error) => {
        throw new Error(
          `health-directorate-organ-donation-client: upload organ donation status failed ${error.type}`,
        )
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
