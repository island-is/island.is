import { AuthMiddleware, CurrentUser } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Inject } from '@nestjs/common'
import { RettindiFyrirIslandIsApi } from '@island.is/clients/district-commissioners-licenses'
import { HealthDirectorateClientService } from '@island.is/clients/health-directorate'
import { OrganizationSlugType } from '@island.is/shared/constants'
import { OccupationalLicenseStatusV2 } from './models/license.model'
import { isDefined } from '@island.is/shared/utils'
import { MMSApi } from '@island.is/clients/mms'
import { HealthDirectorateLicense } from './models/healthDirectorateLicense.model'
import { info } from 'kennitala'
import { EducationLicense } from './models/educationLicense.model'
import { DownloadServiceConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import { handle404 } from '@island.is/clients/middlewares'
import { DistrictCommissionersLicense } from './models/districtCommissionersLicense.model'
import { addLicenseTypePrefix } from './utils'

export class OccupationalLicensesV2Service {
  constructor(
    private readonly dcApi: RettindiFyrirIslandIsApi,
    private readonly healthApi: HealthDirectorateClientService,
    private readonly mmsApi: MMSApi,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadService: ConfigType<typeof DownloadServiceConfig>,
  ) {}
  async getDistrictCommissionerLicenses(
    user: User,
  ): Promise<DistrictCommissionersLicense[] | null> {
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

    const data: Array<DistrictCommissionersLicense> =
      licenses?.leyfi
        ?.map((l) => {
          if (!l || !l.audkenni || !l.stada || !l.stada.titill || !l.titill)
            return

          return {
            licenseId: addLicenseTypePrefix(
              l.audkenni,
              'DistrictCommissioners',
            ),
            licenseNumber: l.audkenni,
            issuer,
            profession: l.stada.titill,
            type: l.titill,
            dateOfBirth: info(user.nationalId).birthday,
            validFrom: l.utgafudagur,
            status: OccupationalLicenseStatusV2.VALID,
            title: l.titill,
          }
        })
        .filter(isDefined) ?? []

    return data
  }
  async getDistrictCommissionerLicenseById(
    user: User,
    id: string,
  ): Promise<DistrictCommissionersLicense | null> {
    const res = await this.dcApi
      .withMiddleware(new AuthMiddleware(user))
      .rettindiFyrirIslandIsGet2({
        audkenni: id,
      })
      .catch(handle404)

    if (!res || !res.leyfi) {
      return null
    }

    const license = res.leyfi

    if (
      !license.audkenni ||
      !license.stada ||
      !license.stada.titill ||
      !license.titill
    ) {
      return null
    }

    const issuer: OrganizationSlugType = 'syslumenn'

    return {
      licenseId: addLicenseTypePrefix(
        license.audkenni,
        'DistrictCommissioners',
      ),
      licenseNumber: license.audkenni,
      issuer,
      profession: license.stada.titill,
      type: license.titill,
      dateOfBirth: info(user.nationalId).birthday,
      validFrom: license.utgafudagur,
      status: OccupationalLicenseStatusV2.VALID,
      title: license.titill,
    }
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
            licenseId: addLicenseTypePrefix(l.licenseNumber, 'Health'),
            issuer,
            type: l.practice,
            licenseNumber: l.licenseNumber,
            title: l.profession,
            id: l.id,
            dateOfBirth: info(l.licenseHolderNationalId).birthday,
            status,
          }
        })
        .filter(isDefined) ?? []
    )
  }

  async getHealthDirectorateLicenseById(
    @CurrentUser() user: User,
    id: string,
  ): Promise<HealthDirectorateLicense | null> {
    const licenses = await this.getHealthDirectorateLicenses(user)

    return licenses?.find((l) => l.licenseNumber === id) ?? null
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
            licenseId: addLicenseTypePrefix(l.id, 'Education'),
            licenseNumber: l.id,
            issuer,
            profession: l.type,
            type: l.issuer,
            licenseHolderName: l.fullName,
            licenseHolderNationalId: l.nationalId,
            titel: `${l.type} - ${l.issuer}`,
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

  async getEducationLicenseById(
    @CurrentUser() user: User,
    id: string,
  ): Promise<EducationLicense | null> {
    const licenses = await this.getEducationLicenses(user)

    return licenses?.find((l) => l.licenseNumber === id) ?? null
  }
}
