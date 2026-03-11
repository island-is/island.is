import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  GeneralApi,
  TrWebApiServicesDomainProfessionsModelsProfessionDto,
  TrWebApiServicesDomainProfessionsModelsActivityOfProfessionDto,
} from '../../../gen/fetch/v1'
import { mapProfessionDto, ProfessionDto } from '../dto/profession.dto'
import {
  mapProfessionActivityDto,
  ProfessionActivityDto,
} from '../dto/professionActivity.dto'

@Injectable()
export class SocialInsuranceAdministrationProfessionService {
  constructor(private readonly generalApi: GeneralApi) {}

  private generalApiWithAuth = (user: User) =>
    this.generalApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getProfessions(
    user: User,
  ): Promise<Array<TrWebApiServicesDomainProfessionsModelsProfessionDto>> {
    return this.generalApiWithAuth(user).apiProtectedV1GeneralProfessionsGet()
  }

  async getActivitiesOfProfessions(
    user: User,
  ): Promise<
    Array<TrWebApiServicesDomainProfessionsModelsActivityOfProfessionDto>
  > {
    return this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralProfessionsActivitiesGet()
  }

  async getProfessionsInDto(user: User): Promise<Array<ProfessionDto> | null> {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralProfessionsGet()

    return (
      data
        .map((d) => mapProfessionDto(d))
        .filter((i): i is ProfessionDto => Boolean(i)) ?? null
    )
  }

  async getProfessionActivitiesInDto(
    user: User,
  ): Promise<Array<ProfessionActivityDto> | null> {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralProfessionsActivitiesGet()

    return (
      data
        .map((d) => mapProfessionActivityDto(d))
        .filter((i): i is ProfessionActivityDto => Boolean(i)) ?? null
    )
  }
}
