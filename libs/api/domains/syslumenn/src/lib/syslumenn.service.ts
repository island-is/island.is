import { Homestay, mapHomestay } from './models/homestay'
import {
  SyslumennAuction,
  mapSyslumennAuction,
} from './models/syslumennAuction'
import { Injectable, Inject } from '@nestjs/common'
import {
  DataUploadResponse,
  constructUploadDataObject,
} from './models/dataUpload'

import { Attachment, Person } from './dto/uploadData.input'
import {
  OperatingLicense,
  mapOperatingLicense,
} from './models/operatingLicense'
import {
  SyslumennApi,
  SyslumennApiConfig,
  VirkarHeimagistingar,
  Uppbod,
  VirkLeyfi,
  Vottord,
} from '@island.is/clients/syslumenn'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  CertificateInfoRepsonse,
  CertificateRepsonse,
  mapCertificateInfo,
} from './models/certificateInfo'

const SYSLUMENN_CLIENT_CONFIG = 'SYSLUMENN_CLIENT_CONFIG'
@Injectable()
export class SyslumennService {
  private id = ''
  private accessToken = ''

  constructor(
    private syslumennApi: SyslumennApi,
    @Inject(SYSLUMENN_CLIENT_CONFIG)
    private clientConfig: SyslumennApiConfig,
  ) {}

  private async login() {
    const config = {
      notandi: this.clientConfig.username,
      lykilord: this.clientConfig.password,
    }

    const { audkenni, accessToken } = await this.syslumennApi.innskraningPost({
      notandi: config,
    })
    if (audkenni && accessToken) {
      this.id = audkenni
      this.accessToken = accessToken
    }
  }

  syslumennApiWithAuth() {
    const auth = {
      scope: [],
      authorization: `Bearer ${this.accessToken}`,
      client: 'client-syslumenn',
    } as Auth

    return this.syslumennApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getHomestays(year?: number): Promise<Homestay[]> {
    await this.login()

    const homestays = year
      ? await this.syslumennApi.virkarHeimagistingarGet({
          audkenni: this.id,
          ar: year ? JSON.stringify(year) : null,
        })
      : await this.syslumennApi.virkarHeimagistingarGetAll({
          audkenni: this.id,
        })

    return ((homestays as VirkarHeimagistingar[]) ?? []).map(mapHomestay)
  }

  async getSyslumennAuctions(): Promise<SyslumennAuction[]> {
    await this.login()
    const syslumennAuctions = await this.syslumennApiWithAuth().uppbodGet({
      audkenni: this.id,
    })

    return ((syslumennAuctions as Uppbod[]) ?? []).map(mapSyslumennAuction)
  }

  async getOperatingLicenses(): Promise<OperatingLicense[]> {
    await this.login()
    const operatingLicenses = await this.syslumennApi.virkLeyfiGet({
      audkenni: this.id,
    })

    return ((operatingLicenses as VirkLeyfi[]) ?? []).map(mapOperatingLicense)
  }

  async uploadData(
    persons: Person[],
    attachment: Attachment,
    applicationType: string,
    extraData?: { [key: string]: string },
  ): Promise<DataUploadResponse> {
    await this.login()

    const payload = constructUploadDataObject(
      this.id,
      persons,
      attachment,
      applicationType,
      extraData,
    )
    return await this.syslumennApiWithAuth().syslMottakaGognPost(payload)
  }

  async getCertificateInfo(
    nationalId: string,
  ): Promise<CertificateInfoRepsonse> {
    await this.login()
    const api = await this.syslumennApiWithAuth()
    const certificate = await api.faVottordUpplysingarGet({
      audkenni: this.id,
      kennitala: nationalId,
    })
    // Once syslumenn openapi defenition is fixed this will not need parsing
    const parsedCertificate = JSON.parse(
      JSON.parse(JSON.stringify(certificate)),
    )
    return mapCertificateInfo(parsedCertificate ?? ('' as Vottord))
  }
}
