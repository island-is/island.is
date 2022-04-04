import { Injectable } from '@nestjs/common'
import type { Auth } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  ApplicationApi,
  MunicipalityApi,
  FilesApi,
} from '@island.is/clients/municipalities-financial-aid'
import { MunicipalityQueryInput } from './models/municipality.input'
import { GetSignedUrlInput } from './dto/getSignedUrl.input'

@Injectable()
export class MunicipalitiesFinancialAidService {
  constructor(
    private applicationApi: ApplicationApi,
    private municipalityApi: MunicipalityApi,
    private filesApi: FilesApi,
  ) { }

  applicationApiWithAuth(auth: Auth) {
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  municipalityApiWithAuth(auth: Auth) {
    return this.municipalityApi.withMiddleware(new AuthMiddleware(auth))
  }

  fileApiWithAuth(auth: Auth) {
    return this.filesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async municipalitiesFinancialAidCurrentApplication(auth: Auth) {
    return await this.applicationApiWithAuth(auth)
      .applicationControllerGetCurrentApplication()
      .then((res) => {
        return res
      })
      .catch((error) => {
        if (error.status === 404) {
          return null
        }
        throw error
      })
  }

  async municipalityInfoForFinancialAId(
    auth: Auth,
    municipalityCode: MunicipalityQueryInput,
  ) {
    return await this.municipalityApiWithAuth(auth)
      .municipalityControllerGetById(municipalityCode)
      .then((res) => {
        return res
      })
      .catch((error) => {
        if (error.status === 404) {
          return null
        }
        throw error
      })
  }

  async municipalitiesFinancialAidCreateSignedUrl(
    auth: Auth,
    getSignedUrl: GetSignedUrlInput,
  ) {
    return await this.fileApiWithAuth(auth)
      .fileControllerCreateSignedUrl({ getSignedUrlDto: getSignedUrl })
      .then((res) => {
        return res
      })
      .catch((error) => {
        throw error
      })
  }
}
