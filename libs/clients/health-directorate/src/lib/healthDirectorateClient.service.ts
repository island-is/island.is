import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  InnsigladSkjal,
  MinarSidur,
  StarfsleyfiAMinumSidumApi,
  StarfsleyfiVottord,
  VottordApi,
} from '../../gen/fetch'
import { Injectable } from '@nestjs/common'
import {
  HealthcareLicense,
  HealthcareLicenseCertificateRequest,
} from './healthDirectorateClient.types'

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

    //TODOx only for testing
    result.push({
      professionId: 'ABC',
      professionNameIs: 'Ljósmóðir',
      professionNameEn: 'Ljósmóðir',
      specialityList: [],
      isTemporary: true,
      validTo: new Date('2024-01-01'),
      isRestricted: false,
    })
    result.push({
      professionId: 'ABC',
      professionNameIs: 'Sjúkraliði',
      professionNameEn: 'Sjúkraliði',
      specialityList: [],
      isTemporary: false,
      isRestricted: true,
    })

    return result
  }

  async submitApplicationHealthcareLicenseCertificate(
    auth: User,
    request: HealthcareLicenseCertificateRequest,
  ): Promise<InnsigladSkjal[]> {
    const result: InnsigladSkjal[] = []

    for (let i = 0; i < request.professionIdList.length; i++) {
      const item = await this.vottordApiWithAuth(auth).vottordUtbuaSkjalPost({
        formDataModel: {
          name: request.fullName,
          dateOfBirth: request.dateOfBirth.toISOString(),
          email: request.email,
          phoneNo: request.phone,
          idProfession: request.professionIdList[i],
        },
      })

      result.push(item[0]) // TODOx why is this an array?
    }

    return result
  }
}
