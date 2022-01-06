import {
  SyslumennAuction,
  Homestay,
  OperatingLicense,
  CertificateInfoResponse,
  DistrictCommissionersAgenciesResponse,
  DataUploadResponse,
  Person,
  Attachment,
} from './syslumennClient.types'
import {
  mapSyslumennAuction,
  mapHomestay,
  mapOperatingLicense,
  mapCertificateInfo,
  mapDistrictCommissionersAgenciesResponse,
  mapDataUploadResponse,
  constructUploadDataObject,
} from './syslumennClient.utils'
import { Injectable, Inject } from '@nestjs/common'
import { SyslumennApi, SvarSkeyti, Configuration } from '../../gen/fetch'
import { SyslumennClientConfig } from './syslumennClient.config'
import type { ConfigType } from '@island.is/nest/config'
import { AuthHeaderMiddleware } from '@island.is/auth-nest-tools'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

@Injectable()
export class SyslumennService {
  constructor(
    @Inject(SyslumennClientConfig.KEY)
    private clientConfig: ConfigType<typeof SyslumennClientConfig>,
  ) {}

  private async createApi() {
    const api = new SyslumennApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-syslumenn',
          ...this.clientConfig.fetch,
        }),
        basePath: this.clientConfig.url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    )

    const config = {
      notandi: this.clientConfig.username,
      lykilord: this.clientConfig.password,
    }

    const { audkenni, accessToken } = await api.innskraningPost({
      notandi: config,
    })
    if (audkenni && accessToken) {
      return {
        id: audkenni,
        api: api.withMiddleware(
          new AuthHeaderMiddleware(`Bearer ${accessToken}`),
        ),
      }
    } else {
      throw new Error('Syslumenn client configuration and login went wrong')
    }
  }

  async getHomestays(year?: number): Promise<Homestay[]> {
    const { id, api } = await this.createApi()

    const homestays = year
      ? await api.virkarHeimagistingarGet({
          audkenni: id,
          ar: year ? JSON.stringify(year) : null,
        })
      : await api.virkarHeimagistingarGetAll({
          audkenni: id,
        })

    return (homestays ?? []).map(mapHomestay)
  }

  async getSyslumennAuctions(): Promise<SyslumennAuction[]> {
    const { id, api } = await this.createApi()
    const syslumennAuctions = await api.uppbodGet({
      audkenni: id,
    })

    return (syslumennAuctions ?? []).map(mapSyslumennAuction)
  }

  async getOperatingLicenses(): Promise<OperatingLicense[]> {
    const { id, api } = await this.createApi()
    const operatingLicenses = await api.virkLeyfiGet({
      audkenni: id,
    })

    return (operatingLicenses ?? []).map(mapOperatingLicense)
  }

  async sealCriminalRecord(criminalRecord: string): Promise<SvarSkeyti> {
    const { id, api } = await this.createApi()
    const explination = 'Rafrænt undirritað vottorð'
    return await api.innsiglunPost({
      skeyti: {
        audkenni: id,
        skyring: explination,
        skjal: criminalRecord,
      },
    })
  }

  async uploadData(
    persons: Person[],
    attachment: Attachment,
    extraData: { [key: string]: string },
    uploadDataName: string,
    uploadDataId?: string,
  ): Promise<DataUploadResponse> {
    const { id, api } = await this.createApi()

    const payload = constructUploadDataObject(
      id,
      persons,
      attachment,
      extraData,
      uploadDataName,
      uploadDataId,
    )

    const response = await api.syslMottakaGognPost(payload)
    return mapDataUploadResponse(response)
  }

  async getCertificateInfo(
    nationalId: string,
  ): Promise<CertificateInfoResponse> {
    const { id, api } = await this.createApi()
    const certificate = await api.faVottordUpplysingarGet({
      audkenni: id,
      kennitala: nationalId,
    })

    return mapCertificateInfo(certificate)
  }

  async getDistrictCommissionersAgencies(): Promise<
    DistrictCommissionersAgenciesResponse[]
  > {
    const { api } = await this.createApi()
    const response = await api.embaettiOgStarfsstodvarGetEmbaetti()
    return response.map(mapDistrictCommissionersAgenciesResponse)
  }
}
