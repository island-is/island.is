import { SyslumennClient } from './client/syslumenn.client'
import { Homestay, mapHomestay } from './models/homestay';
import {
  SyslumennAuction,
  mapSyslumennAuction,
} from './models/syslumennAuction'
import { Injectable, Inject } from '@nestjs/common'
import { Person, Attachment, DataUploadResponse } from './models/dataUpload'
import {
  OperatingLicense,
  mapOperatingLicense,
} from './models/operatingLicense'
import { SyslumennApi, SyslumennApiConfig, VirkarHeimagistingar, Uppbod  } from '@island.is/clients/syslumenn'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools';

const SYSLUMENN_CLIENT_CONFIG = 'SYSLUMENN_CLIENT_CONFIG'
@Injectable()
export class SyslumennService {
  private id = ''
  private accessToken = ''

  constructor(
    private syslumennClient: SyslumennClient,
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
    const config = {
      notandi: this.clientConfig.username,
      lykilord: this.clientConfig.password,
    }

    const response = await this.syslumennApi.innskraningPost({
      notandi: config,
    })

    const auth = {
      scope: [],
      authorization: `Bearer ${this.accessToken}`,
      client: 'client-syslumenn'
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

    return (homestays as VirkarHeimagistingar[] ?? []).map(mapHomestay)
  }

  async getSyslumennAuctions(): Promise<SyslumennAuction[]> {
    await this.login()
    const api = await this.syslumennApiWithAuth()
    const syslumennAuctions = await api.uppbodGet({
      audkenni: this.id,
    })

    return (syslumennAuctions as Uppbod[] ?? []).map(mapSyslumennAuction)
  }

  async getOperatingLicenses(): Promise<OperatingLicense[]> {
    const operatingLicenses = await this.syslumennClient.getOperatingLicenses()

    return (operatingLicenses ?? []).map(mapOperatingLicense)
  }

  async uploadData(
    persons: Person[],
    attachement: Attachment,
    extraData: { [key: string]: string },
  ): Promise<DataUploadResponse> {
    return await this.syslumennClient.uploadData(
      persons,
      attachement,
      extraData,
    )
  }
}
