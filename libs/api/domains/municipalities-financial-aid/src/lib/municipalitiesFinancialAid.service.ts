import { Injectable } from '@nestjs/common'

import type { Auth } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  ApplicationApi,
  FilesApi,
} from '@island.is/clients/municipalities-financial-aid'
import { FetchError } from '@island.is/clients/middlewares'
import {
  ApplicationFilesInput,
  CreateSignedUrlInput,
  GetSignedUrlInput,
} from './dto'
import { ApplicationInput } from './dto/application.input'
import { UpdateApplicationInput } from './dto/updateApplication.input'

@Injectable()
export class MunicipalitiesFinancialAidService {
  constructor(
    private applicationApi: ApplicationApi,
    private filesApi: FilesApi,
  ) {}

  applicationApiWithAuth(auth: Auth) {
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
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
    return await this.fileApiWithAuth(auth).fileControllerCreateFiles({
      createFilesDto: files as any,
    })
  }

  async municipalitiesFinancialAidUpdateApplication(
    auth: Auth,
    updates: UpdateApplicationInput,
  ) {
    return await this.applicationApiWithAuth(auth)
      .applicationControllerUpdate({
        id: updates.id,
        updateApplicationDto: updates as any,
      })
      .catch(this.handle404)
  }

  async municipalitiesFinancialAidGetSignedUrl(
    auth: Auth,
    id: GetSignedUrlInput,
  ) {
    return await this.fileApiWithAuth(auth).fileControllerCreateSignedUrlForId(
      id,
    )
  }

  async municipalitiesFinancialAidGetApplicationsForPeriod(auth: Auth) {
    console.log('HELLOOOOOOOO')
    return await this.applicationApiWithAuth(auth)
      .applicationControllerGetAllForPeriod({
        dateFrom: '2021-01-01',
        dateTo: '2021-12-31',
      })
      .catch(this.handle404)
  }
}
