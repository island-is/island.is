import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  MinarSidur,
  StarfsleyfiAMinumSidumApi,
  VottordApi,
} from '../../gen/fetch'
import { Injectable } from '@nestjs/common'
import {
  HealthcareLicense,
  HealthcareLicenseCertificate,
  HealthcareLicenseCertificateRequest,
} from './healthDirectorateClient.types'
import format from 'date-fns/format'

@Injectable()
export class HealthDirectorateClientService {
  constructor(
    private readonly starfsleyfiAMinumSidumApi: StarfsleyfiAMinumSidumApi,
    private readonly vottordApi: VottordApi,
  ) {}

  private starfsleyfiAMinumSidumApiWithAuth(auth: Auth) {
    return this.starfsleyfiAMinumSidumApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  private vottordApiWithAuth(auth: Auth) {
    return this.vottordApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async getHealthDirectorateLicense(
    auth: User,
  ): Promise<Array<MinarSidur> | null> {
    return this.starfsleyfiAMinumSidumApiWithAuth(
      auth,
    ).starfsleyfiAMinumSidumGet()
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
