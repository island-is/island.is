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
} from '@island.is/clients/syslumenn'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'

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

    const response = await this.syslumennApi.innskraningPost({
      notandi: config,
    })
    if (response.audkenni && response.accessToken) {
      this.id = response.audkenni
      this.accessToken = response.accessToken
    }
  }
  private async syslumennApiWithAuth() {
    await this.login()

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
    const api = await this.syslumennApiWithAuth()
    const syslumennAuctions = await api.uppbodGet({
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
    extraData: { [key: string]: string },
    applicationType: string = 'Lögheimilisbreyting barns',
  ): Promise<DataUploadResponse> {
    const api = await this.syslumennApiWithAuth()

    const payload = constructUploadDataObject(
      this.id,
      persons,
      attachment,
      extraData,
      applicationType,
    )

    await api.syslMottakaGognPost(payload)
    return {
      "skilabod": "Gögn móttekin",
      "audkenni": "95dce120-2bf0-4443-94f8-928b93d45776",
      "malsnumer": "2021001234"
  }

  }
}
