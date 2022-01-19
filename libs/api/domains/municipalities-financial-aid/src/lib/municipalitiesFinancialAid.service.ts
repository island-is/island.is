import { Injectable } from '@nestjs/common'
import type { Auth } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  ApplicationApi,
  MunicipalityApi,
} from '@island.is/clients/municipalities-financial-aid'
import { MunicipalityQueryInput } from './models/municipality.input'

@Injectable()
export class MunicipalitiesFinancialAidService {
  constructor(
    private applicationApi: ApplicationApi,
    private municipalityApi: MunicipalityApi,
  ) {}

  applicationApiWithAuth(auth: Auth) {
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  municipalityApiWithAuth(auth: Auth) {
    return this.municipalityApi.withMiddleware(new AuthMiddleware(auth))
  }

  async municipalitiesFinancialAidCurrentApplication(
    auth: Auth,
    nationalId: string,
  ) {
    return await this.applicationApiWithAuth(auth)
      .applicationControllerGetCurrentApplication({
        nationalId,
      })
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
}
