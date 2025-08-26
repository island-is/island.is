import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Inject, Injectable } from '@nestjs/common'
import { RettindiFyrirIslandIsApi } from '../../gen/fetch'
import {
  DistrictCommissionersLicenseDto,
  mapLicenseDto,
} from './dto/districtCommissionersLicenseDto'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { LOG_CATEGORY } from './districtCommissionersLicenses.types'
import { isDefined } from '@island.is/shared/utils'
import { handle404 } from '@island.is/clients/middlewares'
import {
  DistrictCommissionersLicenseInfoDto,
  mapLicenseInfoDto,
} from './dto/districtCommissionersLicenseInfoDto'
import { Locale } from '@island.is/shared/types'

@Injectable()
export class DistrictCommissionersLicensesService {
  constructor(
    private readonly api: RettindiFyrirIslandIsApi,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private apiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  async getLicenses(
    user: User,
  ): Promise<Array<DistrictCommissionersLicenseInfoDto>> {
    const licenseInfo = await this.apiWithAuth(user)
      .rettindiFyrirIslandIsGet()
      .catch(handle404)

    return (
      licenseInfo?.leyfi
        ?.map((l) => {
          if (!l?.audkenni) {
            this.logger.warn('Invalid district commissioners license,', {
              category: LOG_CATEGORY,
            })
            return null
          }

          return mapLicenseInfoDto(l)
        })
        .filter(isDefined) ?? []
    )
  }

  async getLicense(
    user: User,
    id: string,
    locale: Locale = 'is',
  ): Promise<DistrictCommissionersLicenseDto | null> {
    const license = await this.apiWithAuth(user)
      .rettindiFyrirIslandIsGetStakt({
        audkenni: id,
        locale,
      })
      .catch(handle404)

    if (!license?.leyfi?.audkenni) {
      this.logger.warn('Invalid district commissioners license,', {
        category: LOG_CATEGORY,
      })
      return null
    }

    return mapLicenseDto(license)
  }
}
