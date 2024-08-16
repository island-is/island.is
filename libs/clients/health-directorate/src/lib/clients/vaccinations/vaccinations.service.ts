import { AuthMiddleware, Auth } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { Injectable } from '@nestjs/common'
import {
  DiseaseVaccinationDto,
  MeVaccinationControllerGetVaccinationForDiseaseRequest,
  MeVaccinationControllerGetVaccinationsForDiseasesRequest,
  MeVaccinationsApi,
  VaccinationDto,
} from './gen/fetch'

@Injectable()
export class HealthDirectorateVaccinationsService {
  constructor(private readonly vaccinationsApi: MeVaccinationsApi) {}

  private vaccinationsApiWithAuth(auth: Auth) {
    return this.vaccinationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async getVaccinations(
    auth: Auth,
  ): Promise<Array<VaccinationDto> | null> {
    const vaccines = await this.vaccinationsApiWithAuth(auth)
      .meVaccinationControllerGetVaccinations()
      .catch(handle404)

    if (!vaccines) {
      return null
    }

    return vaccines
  }

  public async getVaccinationDiseaseDetail(
    auth: Auth,
    input: MeVaccinationControllerGetVaccinationsForDiseasesRequest,
  ): Promise<Array<DiseaseVaccinationDto> | null> {
    const disease = await this.vaccinationsApiWithAuth(auth)
      .meVaccinationControllerGetVaccinationsForDiseases(input)
      .catch(handle404)

    if (!disease) {
      return null
    }

    return disease
  }
}
