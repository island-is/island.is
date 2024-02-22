import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Inject, Injectable } from '@nestjs/common'
import { RettindiFyrirIslandIsApi, Leyfi } from '../../gen/fetch'
import { DistrictCommissionersLicenseDto } from './dto/districtCommissionersLicenseDto'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { LOG_CATEGORY } from './districtCommissionersLicenses.types'
import { mapStatusToLiteral } from './util'
import { isDefined } from '@island.is/shared/utils'
import { handle404 } from '@island.is/clients/middlewares'

@Injectable()
export class DistrictCommissionersLicensesService {
  constructor(
    private readonly api: RettindiFyrirIslandIsApi,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private apiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  private mapLicenseToDto = (license: Leyfi) => {
    if (!license?.audkenni) {
      this.logger.warn('Invalid district commissioners license,', {
        category: LOG_CATEGORY,
      })
      return null
    }

    return {
      id: license?.audkenni,
      title: license?.titill,
      validFrom: license?.utgafudagur,
      issuer: license?.utgefandi?.titill,
      status: license?.stada?.kodi
        ? mapStatusToLiteral(license?.stada?.kodi)
        : undefined,
    }
  }

  async getLicenses(
    user: User,
  ): Promise<Array<DistrictCommissionersLicenseDto>> {
    const licenseInfo = await this.apiWithAuth(user)
      .rettindiFyrirIslandIsGet({
        kennitala: '0101303019',
      })
      .catch(handle404)

    return (
      licenseInfo?.leyfi
        ?.map((l) => this.mapLicenseToDto(l))
        .filter(isDefined) ?? []
    )
  }

  async getLicense(
    user: User,
    id: string,
  ): Promise<DistrictCommissionersLicenseDto | null> {
    const license = await this.apiWithAuth(user)
      .rettindiFyrirIslandIsGet2({
        audkenni: id,
      })
      .catch(handle404)

    if (!license?.leyfi?.audkenni) {
      this.logger.warn('Invalid district commissioners license,', {
        category: LOG_CATEGORY,
      })
      return null
    }

    return this.mapLicenseToDto(license.leyfi)
  }
}
