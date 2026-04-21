import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  GeneralApi,
  TrWebCommonsExternalPortalsApiModelsGeneralEmploymentStatusesForLanguage,
} from '../../../gen/fetch/v1'
import { EmploymentDto, mapEmploymentDto } from '../dto/employment.dto'
import { Locale } from '@island.is/shared/types'

@Injectable()
export class SocialInsuranceAdministrationEmploymentService {
  constructor(private readonly generalApi: GeneralApi) {}

  private generalApiWithAuth = (user: User) =>
    this.generalApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getEmploymentStatusesWithLocale(
    user: User,
    locale: Locale,
  ): Promise<Array<EmploymentDto> | null> {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralEmploymentStatusGet()

    const filteredData = data.find(
      (d) => d.languageCode === locale.toString().toUpperCase(),
    )

    if (!filteredData) {
      throw new Error('Locale not supplied in response')
    }

    return (
      filteredData.employmentStatuses
        ?.map((es) => mapEmploymentDto(es))
        .filter((i): i is EmploymentDto => Boolean(i)) ?? null
    )
  }

  async getEmploymentStatuses(
    user: User,
  ): Promise<
    Array<TrWebCommonsExternalPortalsApiModelsGeneralEmploymentStatusesForLanguage>
  > {
    return this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralEmploymentStatusGet()
  }
}
