import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { StarfsleyfiAMinumSidumApi, VottordApi } from '../../gen/fetch'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import {
  HealthDirectorateLicenseStatus,
  HealthDirectorateLicenseToPractice,
  HealthcareLicense,
  HealthcareLicenseCertificate,
  HealthcareLicenseCertificateRequest,
} from './healthDirectorateClient.types'
import { isDefined } from '@island.is/shared/utils'
import format from 'date-fns/format'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { handle404 } from '@island.is/clients/middlewares'

@Injectable()
export class HealthDirectorateClientService {
  constructor(
    private readonly starfsleyfiAMinumSidumApi: StarfsleyfiAMinumSidumApi,
    private readonly vottordApi: VottordApi,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private starfsleyfiAMinumSidumApiWithAuth(auth: Auth) {
    return this.starfsleyfiAMinumSidumApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  private vottordApiWithAuth(auth: Auth) {
    return this.vottordApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async getHealthDirectorateLicenseToPractice(
    auth: User,
  ): Promise<Array<HealthDirectorateLicenseToPractice> | null> {
    const licenses = await this.starfsleyfiAMinumSidumApiWithAuth(auth)
      .starfsleyfiAMinumSidumGet()
      .catch(handle404)

    if (!licenses) {
      return null
    }

    const mappedLicenses: Array<HealthDirectorateLicenseToPractice> =
      licenses
        ?.map((l) => {
          if (
            !l.id ||
            !l.logadiliID ||
            !l.kennitala ||
            !l.nafn ||
            !l.starfsstett ||
            !l.leyfi ||
            !l.leyfisnumer ||
            !l.gildirFra
          ) {
            return null
          }

          let status: HealthDirectorateLicenseStatus
          switch (l.stada) {
            case 'Í gildi':
              status = 'VALID'
              break
            case 'Í gildi - Takmörkun':
              status = 'LIMITED'
              break
            case 'Ógilt':
              status = 'INVALID'
              break
            default:
              status = 'UNKNOWN'
          }

          return {
            id: l.id,
            legalEntityId: l.logadiliID,
            licenseHolderNationalId: l.kennitala,
            licenseHolderName: l.nafn,
            profession: l.starfsstett,
            practice: l.leyfi,
            licenseNumber: l.leyfisnumer,
            validFrom: l.gildirFra,
            validTo: l.gildirTIl ?? undefined,
            status,
          }
        })
        .filter(isDefined) ?? []
    return mappedLicenses
  }

  async getMyHealthcareLicenses(auth: Auth): Promise<HealthcareLicense[]> {
    const items = await this.vottordApiWithAuth(
      auth,
    ).vottordStarfsleyfiVottordGet()

    const result: HealthcareLicense[] = []

    // loop through items to group together specialities per profession
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const professionId = item.idProfession

      let index = result.findIndex((x) => x.professionId === professionId)

      if (index === -1) {
        const count = result.push({
          professionId: item.idProfession || '',
          professionNameIs: item.professionIsl || '',
          professionNameEn: item.professionEn || '',
          specialityList: [],
          isTemporary: false,
          isRestricted: item.isRestricted === 1,
        })

        index = count - 1
      }

      if (item.isSpeciality) {
        result[index].specialityList.push({
          specialityNameIs: item.specialityIsl || '',
          specialityNameEn: item.specialityEn || '',
        })
      }

      if (item.validTo) {
        result[index].isTemporary = true
        result[index].validTo = item.validTo
      }
    }

    return result
  }

  async submitApplicationHealthcareLicenseCertificate(
    auth: User,
    request: HealthcareLicenseCertificateRequest,
  ): Promise<HealthcareLicenseCertificate[]> {
    return Promise.all(
      request.professionIdList.map(async (professionId) => {
        const item = await this.vottordApiWithAuth(auth).vottordUtbuaSkjalPost({
          utbuaSkjalRequest: {
            name: request.fullName,
            dateOfBirth: format(new Date(request.dateOfBirth), 'dd.MM.yyyy'),
            email: request.email,
            phoneNo: request.phone,
            idProfession: professionId,
          },
        })

        if (!item.base64String) {
          throw new Error('Empty file')
        }

        return {
          professionId: professionId,
          base64: item.base64String,
        }
      }),
    )
  }
}
