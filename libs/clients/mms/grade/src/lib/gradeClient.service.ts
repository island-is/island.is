import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Inject, Injectable } from '@nestjs/common'
import { GradesApi } from '../../gen/fetch'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import {
  StudentGradeLevelAssessmentDto,
  mapStudentGradeLevelAssessmentDto,
} from './dto/studentGradeLevelAssessment.dto'
import {
  StudentAssessmentsDto,
  mapStudentAssessmentsDto,
} from './dto/familyAssessments.dto'
import { isDefined } from '@island.is/shared/utils'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

const LOG_CATEGORY = 'clients-mms-grade'

@Injectable()
export class GradeClientService {
  constructor(
    private readonly api: GradesApi,
    private readonly nationalRegistryService: NationalRegistryV3ClientService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private apiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  async getStudentAssessments(
    user: User,
  ): Promise<Array<StudentGradeLevelAssessmentDto>> {
    const data = await this.apiWithAuth(
      user,
    ).publicGradeV2ControllerGetStudentAssessment({
      nationalId: user.nationalId,
    })

    return data.einkunnir.map((e) => mapStudentGradeLevelAssessmentDto(e))
  }

  async getUserFamilyStudentAssessments(
    user: User,
  ): Promise<Array<StudentAssessmentsDto> | null> {
    const userData = await this.nationalRegistryService
      .getAllDataIndividual(user.nationalId)
      .catch((e) => {
        this.logger.warn('National registry info fetch failed for user', {
          error: e,
          category: LOG_CATEGORY,
        })
        return null
      })

    if (!userData?.nafn || !userData?.kennitala) {
      this.logger.warn('National registry info missing data. Returning null', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const family: Array<{ name: string; nationalId: string }> = [
      {
        name: userData?.nafn,
        nationalId: userData?.kennitala,
      },
      ...(userData?.forsja?.born
        ?.map((child) => {
          if (child.barnNafn && child.barnKennitala) {
            return {
              name: child.barnNafn,
              nationalId: child.barnKennitala,
            }
          }
          return null
        })
        .filter(isDefined) ?? []),
    ]

    return Promise.all(
      family.map(async (person) => {
        const assessmentData = await this.apiWithAuth(
          user,
        ).publicGradeV2ControllerGetStudentAssessment({
          nationalId: user.nationalId,
        })

        return mapStudentAssessmentsDto(
          person.name,
          person.nationalId,
          assessmentData.einkunnir,
        )
      }),
    )
  }
}
