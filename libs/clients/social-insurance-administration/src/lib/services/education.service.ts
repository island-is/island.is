import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  GeneralApi,
  TrWebApiServicesDomainEducationalInstitutionsModelsEducationalInstitutionsDto,
  TrWebApiServicesDomainEducationalInstitutionsModelsEctsUnitDto,
  TrWebApiServicesDomainEducationalInstitutionsModelsEducationLevelDto,
} from '../../../gen/fetch/v1'
import { ApplicationTypeEnum } from '../enums'
import { mapApplicationEnumToType } from '../mapper'

@Injectable()
export class SocialInsuranceAdministrationEducationService {
  constructor(private readonly generalApi: GeneralApi) {}

  private generalApiWithAuth = (user: User) =>
    this.generalApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getEducationalInstitutions(
    user: User,
  ): Promise<
    Array<TrWebApiServicesDomainEducationalInstitutionsModelsEducationalInstitutionsDto>
  > {
    return this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralEducationalinstitutionsGet()
  }

  async getEctsUnits(
    user: User,
  ): Promise<
    Array<TrWebApiServicesDomainEducationalInstitutionsModelsEctsUnitDto>
  > {
    return this.generalApiWithAuth(user).apiProtectedV1GeneralEctsUnitsGet()
  }

  async getEducationLevelsWithEnum(
    user: User,
    applicationType: ApplicationTypeEnum,
  ): Promise<Array<TrWebApiServicesDomainEducationalInstitutionsModelsEducationLevelDto> | null> {
    const applicationTypeMapped = mapApplicationEnumToType(applicationType)

    if (!applicationTypeMapped) {
      return Promise.resolve(null)
    }

    return this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralEducationlevelsApplicationTypeGet({
      applicationType: applicationTypeMapped,
    })
  }

  async getEducationLevels(
    user: User,
    applicationType: string,
  ): Promise<
    Array<TrWebApiServicesDomainEducationalInstitutionsModelsEducationLevelDto>
  > {
    return this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralEducationlevelsApplicationTypeGet({
      applicationType,
    })
  }
}
