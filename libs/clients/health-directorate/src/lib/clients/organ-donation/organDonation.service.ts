import { AuthMiddleware, Auth } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { Injectable } from '@nestjs/common'
import {
  DonationExceptionsApi,
  Locale,
  MeDonorStatusApi,
  OrganDonorDto,
} from './gen/fetch'

@Injectable()
export class HealthDirectorateOrganDonationService {
  constructor(
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
      .catch(handle404)
  }

  public async getDonationExceptions(
    auth: Auth,
    input: Locale,
  ): Promise<unknown | null> {
    const donationExceptions = await this.donationExceptionsApi
      .withMiddleware(new AuthMiddleware(auth))
      .donationExceptionControllerGetOrgans({ locale: input })
      .catch(handle404)

    if (!donationExceptions) {
      return null
    }

    return donationExceptions
  }
}
