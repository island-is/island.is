import { Injectable } from '@nestjs/common'

import type { Auth } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  ApplicationApi,
  MunicipalityApi,
  FilesApi,
} from '@island.is/clients/municipalities-financial-aid'
import { FetchError } from '@island.is/clients/middlewares'
import {
  ApplicationFilesInput,
  CreateSignedUrlInput,
  MunicipalityInput,
} from './dto'
import { ApplicationInput } from './dto/application.input'

@Injectable()
export class MunicipalitiesFinancialAidService {
  constructor(
    private applicationApi: ApplicationApi,
    private municipalityApi: MunicipalityApi,
    private filesApi: FilesApi,
  ) {}

  applicationApiWithAuth(auth: Auth) {
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  municipalityApiWithAuth(auth: Auth) {
    return this.municipalityApi.withMiddleware(new AuthMiddleware(auth))
  }

  fileApiWithAuth(auth: Auth) {
    return this.filesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private handle404(error: FetchError) {
    if (error.status === 404) {
      return null
    }
    throw error
  }

  async municipalitiesFinancialAidCurrentApplication(auth: Auth) {
    return await this.applicationApiWithAuth(auth)
      .applicationControllerGetCurrentApplication()
      .catch(this.handle404)
  }

  async municipalityInfoForFinancialAId(
    auth: Auth,
    municipalityCode: MunicipalityInput,
  ) {
    return await this.municipalityApiWithAuth(auth)
      .municipalityControllerGetById(municipalityCode)
      .catch(this.handle404)
  }

  async municipalitiesFinancialAidCreateSignedUrl(
    auth: Auth,
    getSignedUrl: CreateSignedUrlInput,
  ) {
    return await this.fileApiWithAuth(auth).fileControllerCreateSignedUrl({
      getSignedUrlDto: getSignedUrl,
    })
  }

  async municipalitiesFinancialAidApplication(
    auth: Auth,
    applicationId: ApplicationInput,
  ) {
    return await this.applicationApiWithAuth(auth)
      .applicationControllerGetById(applicationId)
      .catch(this.handle404)
  }

  async municipalitiesFinancialAidCreateFiles(
    auth: Auth,
    files: ApplicationFilesInput,
  ) {
    return await this.fileApiWithAuth(auth)
      .fileControllerCreateFiles({ createFilesDto: files as any })
      .catch(this.handle404)
  }
}
