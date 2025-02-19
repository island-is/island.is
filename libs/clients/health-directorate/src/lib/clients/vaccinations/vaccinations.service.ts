import { AuthMiddleware, Auth } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { Inject, Injectable } from '@nestjs/common'
import {
  DiseaseVaccinationDto,
  MeVaccinationControllerGetVaccinationsForDiseasesLocaleEnum,
  MeVaccinationsApi,
  VaccinationDto,
} from './gen/fetch'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

const LOG_CATEGORY = 'health-directorate-vaccinations-api'
@Injectable()
export class HealthDirectorateVaccinationsService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly vaccinationsApi: MeVaccinationsApi,
  ) {}

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
      this.logger.debug('No vaccines returned', {
        category: LOG_CATEGORY,
      })
      return null
    }

    return vaccines
  }

  public async getVaccinationDiseaseDetail(
    auth: Auth,
    locale: string,
  ): Promise<Array<DiseaseVaccinationDto> | null> {
    const disease = await this.vaccinationsApiWithAuth(auth)
      .meVaccinationControllerGetVaccinationsForDiseases({
        locale:
          locale === 'is'
            ? MeVaccinationControllerGetVaccinationsForDiseasesLocaleEnum.Is
            : MeVaccinationControllerGetVaccinationsForDiseasesLocaleEnum.En,
      })
      .catch(handle404)

    if (!disease) {
      this.logger.debug('No vaccines diseases returned', {
        category: LOG_CATEGORY,
      })
      return null
    }

    return disease
  }
}
