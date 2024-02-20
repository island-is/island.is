import { AuthMiddleware, CurrentUser } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Inject } from '@nestjs/common'
import { RettindiFyrirIslandIsApi } from '@island.is/clients/district-commissioners-licenses'
import { HealthDirectorateClientService } from '@island.is/clients/health-directorate'
import { OccupationalLicenseV2 } from './models/occupationalLicense.model'
import { OrganizationSlugType } from '@island.is/shared/constants'
import { OccupationalLicenseStatusV2 } from './models/occupationalLicense.model'
import { isDefined } from '@island.is/shared/utils'
import { MMSApi } from '@island.is/clients/mms'
import { HealthDirectorateLicense } from './models/healthDirectorateLicense.model'
import { info } from 'kennitala'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { EducationLicense } from './models/educationLicense.model'
import { DownloadServiceConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import { handle404 } from '@island.is/clients/middlewares'

export class OccupationalLicensesV2Service {
  constructor(
    private readonly dcApi: RettindiFyrirIslandIsApi,
    private readonly healthApi: HealthDirectorateClientService,
    private readonly mmsApi: MMSApi,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadService: ConfigType<typeof DownloadServiceConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getAllLicenses(
    user: User,
  ): Promise<Array<OccupationalLicenseV2> | null> {
    const promises = [
      this.getDistrictCommissionerLicenses(user),
      this.getEducationLicenses(user),
      this.getHealthDirectorateLicenses(user),
    ]

    let data: Array<OccupationalLicenseV2> = []
    const errors: Array<Error> = []

    //We want the errors but we also want to execute the promises in parallel
    await Promise.all(
      promises.map((p) =>
        p
          .then((p) => {
            this.logger.debug('p', p)
            if (p) {
              data = data.concat(p)
            }
          })
          .catch((e: Error) => errors.push(e)),
      ),
    )

    this.logger.debug('data', data)
    this.logger.debug('errors', errors)

    return data
  }

  async getDistrictCommissionerLicenses(
    @CurrentUser() user: User,
  ): Promise<OccupationalLicenseV2[] | null> {
    const licenses = await this.dcApi
      .withMiddleware(new AuthMiddleware(user))
      .rettindiFyrirIslandIsGet({
        kennitala: '0101303019',
      })
      .catch(handle404)

    if (!licenses) {
      return []
    }

    const issuer: OrganizationSlugType = 'syslumenn'

    const data: Array<OccupationalLicenseV2> =
      licenses?.leyfi
        ?.map((l) => {
          if (!l || !l.audkenni || !l.stada || !l.stada.titill || !l.titill)
            return

          return {
            licenseId: l.audkenni,
            issuer,
            profession: l.stada.titill,
            type: l.titill,
            dateOfBirth: info(user.nationalId).birthday,
            validFrom: l.utgafudagur,
            status: OccupationalLicenseStatusV2.VALID,
          }
        })
        .filter(isDefined) ?? []

    return data
  }
  async getHealthDirectorateLicenses(
    @CurrentUser() user: User,
  ): Promise<Array<HealthDirectorateLicense> | null> {
    const licenses = await this.healthApi.getHealthDirectorateLicenseToPractice(
      user,
    )

    const issuer: OrganizationSlugType = 'landlaeknir'

    return (
      licenses
        ?.map((l) => {
          let status: OccupationalLicenseStatusV2
          switch (l.status) {
            case 'LIMITED':
              status = OccupationalLicenseStatusV2.LIMITED
              break
            case 'VALID':
              status = OccupationalLicenseStatusV2.VALID
              break
            default:
              status = OccupationalLicenseStatusV2.ERROR
          }
          return {
            ...l,
            number: l.licenseNumber,
            issuer,
            type: l.practice,
            licenseId: l.licenseNumber,
            id: l.id,
            dateOfBirth: info(l.licenseHolderNationalId).birthday,
            status,
          }
        })
        .filter(isDefined) ?? []
    )
  }

  async getEducationLicenses(
    @CurrentUser() user: User,
  ): Promise<EducationLicense[] | null> {
    const licenses = await this.mmsApi.getLicenses(user.nationalId)

    const issuer: OrganizationSlugType = 'menntamalastofnun'

    const data: Array<EducationLicense> =
      licenses
        .map((l) => {
          return {
            licenseId: l.id,
            issuer,
            profession: l.type,
            type: l.issuer,
            licenseHolderName: l.fullName,
            licenseHolderNationalId: l.nationalId,
            dateOfBirth: info(l.nationalId).birthday,
            downloadUrl: `${this.downloadService.baseUrl}/download/v1/occupational-licenses/education/${l.id}`,
            validFrom: new Date(l.issued),
            status:
              new Date(l.issued) < new Date()
                ? OccupationalLicenseStatusV2.VALID
                : OccupationalLicenseStatusV2.ERROR,
          }
        })
        .filter(isDefined) ?? []

    return data
  }
}
