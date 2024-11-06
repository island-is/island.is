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
    /**/

    const mockData = {
      einkunnir: [
        {
          bekkur: 4,
          namsgreinar: [
            {
              heiti: 'Testlenskan',
              dagsetning: new Date(1990, 1, 1),
              haefnieinkunn: 'Glæsó',
              haefnieinkunnStada: 'A+123',
              samtals: {
                heiti: 'bing',
                radeinkunn: {
                  einkunn: '99',
                  heiti: 'Raðeinkunn',
                  vaegi: 0,
                },
                grunnskolaeinkunn: {
                  einkunn: '67',
                  heiti: 'Grunnskólaeinkunn',
                  vaegi: 0,
                },
              },
              framfaraTexti: {
                einkunn: 'Framfarir eru flottar og mikilvægar jibbí',
                heiti: 'Framfaratexti',
                vaegi: 0,
              },
              einkunnir: [
                {
                  heiti: 'Lesskilningur',
                  radeinkunn: {
                    einkunn: '896',
                    heiti: 'Lesskilningur, raðeinkunn',
                    vaegi: 97,
                  },
                  grunnskolaeinkunn: {
                    einkunn: '2',
                    heiti: 'Lesskilningur, Grunnskólaeinkunn',
                    vaegi: 97,
                  },
                },
                {
                  heiti: 'Málnotkun',
                  radeinkunn: {
                    einkunn: '896',
                    heiti: 'Málnotkun, raðeinkunn',
                    vaegi: 64,
                  },
                  grunnskolaeinkunn: {
                    einkunn: '2',
                    heiti: 'Málnotkun, Grunnskólaeinkunn',
                    vaegi: 965,
                  },
                },
              ],
              ordOgTalnadaemi: {
                einkunn: 'Test svipað gott í öllum fögum',
                heiti: 'Frammistaða í hinu og þessu',
                vaegi: 0,
              },
            },
            {
              heiti: 'Stærðófræðó',
              dagsetning: new Date(1650, 1, 1),
              haefnieinkunn: 'Slæm',
              haefnieinkunnStada: 'F--',
              samtals: {
                heiti: 'bunrb',
                radeinkunn: {
                  einkunn: '3',
                  heiti: 'Raðeinkunn',
                  vaegi: 0,
                },
                grunnskolaeinkunn: {
                  einkunn: '8765',
                  heiti: 'Grunnskólaeinkunn',
                  vaegi: 0,
                },
              },
              framfaraTexti: {
                einkunn: 'Framfarir eru lit',
                heiti: 'Framfaratexti',
                vaegi: 0,
              },
              einkunnir: [
                {
                  heiti: 'Samlagning',
                  radeinkunn: {
                    einkunn: '88',
                    heiti: 'Samlagning, raðeinkunn',
                    vaegi: 97,
                  },
                  grunnskolaeinkunn: {
                    einkunn: '287692',
                    heiti: 'Samlagning, Grunnskólaeinkunn',
                    vaegi: 97,
                  },
                },
                {
                  heiti: 'Ekki gera vitlaust',
                  radeinkunn: {
                    einkunn: '89756',
                    heiti: 'Málnotkun, raðeinkunn',
                    vaegi: 64,
                  },
                  grunnskolaeinkunn: {
                    einkunn: '-7654',
                    heiti: 'Málnotkun, Grunnskólaeinkunn',
                    vaegi: 965,
                  },
                },
              ],
              ordOgTalnadaemi: {
                einkunn: 'L+elegt',
                heiti: 'Frekar',
                vaegi: 0,
              },
            },
          ],
        },
        {
          bekkur: 9,
          namsgreinar: [
            {
              heiti: 'Bíngó',
              dagsetning: new Date(1990, 1, 1),
              haefnieinkunn: 'Glæsó',
              haefnieinkunnStada: 'A+123',
              samtals: {
                heiti: 'goieo',
                radeinkunn: {
                  einkunn: '99',
                  heiti: 'Raðeinkunn',
                  vaegi: 0,
                },
                grunnskolaeinkunn: {
                  einkunn: '67',
                  heiti: 'Grunnskólaeinkunn',
                  vaegi: 0,
                },
              },
              framfaraTexti: {
                einkunn: 'Framfarir eru flottar og mikilvægar jibbí',
                heiti: 'Framfaratexti',
                vaegi: 0,
              },
              einkunnir: [
                {
                  heiti: 'Lesskilningur',
                  radeinkunn: {
                    einkunn: '896',
                    heiti: 'Lesskilningur, raðeinkunn',
                    vaegi: 97,
                  },
                  grunnskolaeinkunn: {
                    einkunn: '2',
                    heiti: 'Lesskilningur, Grunnskólaeinkunn',
                    vaegi: 97,
                  },
                },
                {
                  heiti: 'Málnotkun',
                  radeinkunn: {
                    einkunn: '896',
                    heiti: 'Málnotkun, raðeinkunn',
                    vaegi: 64,
                  },
                  grunnskolaeinkunn: {
                    einkunn: '2',
                    heiti: 'Málnotkun, Grunnskólaeinkunn',
                    vaegi: 965,
                  },
                },
              ],
              ordOgTalnadaemi: {
                einkunn: 'Bah',
                heiti: 'Hab',
                vaegi: 0,
              },
            },
          ],
        },
      ],
    }

    return mockData.einkunnir.map((e) => mapStudentGradeLevelAssessmentDto(e))
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

    const mockData = {
      einkunnir: [
        {
          bekkur: 4,
          namsgreinar: [
            {
              heiti: 'Testlenskan',
              dagsetning: new Date(1990, 1, 1),
              haefnieinkunn: 'Glæsó',
              haefnieinkunnStada: 'A+123',
              samtals: {
                heiti: 'bing',
                radeinkunn: {
                  einkunn: '99',
                  heiti: 'Raðeinkunn',
                  vaegi: 0,
                },
                grunnskolaeinkunn: {
                  einkunn: '67',
                  heiti: 'Grunnskólaeinkunn',
                  vaegi: 0,
                },
              },
              framfaraTexti: {
                einkunn: 'Framfarir eru flottar og mikilvægar jibbí',
                heiti: 'Framfaratexti',
                vaegi: 0,
              },
              einkunnir: [
                {
                  heiti: 'Lesskilningur',
                  radeinkunn: {
                    einkunn: '896',
                    heiti: 'Lesskilningur, raðeinkunn',
                    vaegi: 97,
                  },
                  grunnskolaeinkunn: {
                    einkunn: '2',
                    heiti: 'Lesskilningur, Grunnskólaeinkunn',
                    vaegi: 97,
                  },
                },
                {
                  heiti: 'Málnotkun',
                  radeinkunn: {
                    einkunn: '896',
                    heiti: 'Málnotkun, raðeinkunn',
                    vaegi: 64,
                  },
                  grunnskolaeinkunn: {
                    einkunn: '2',
                    heiti: 'Málnotkun, Grunnskólaeinkunn',
                    vaegi: 965,
                  },
                },
              ],
              ordOgTalnadaemi: {
                einkunn: 'Test svipað gott í öllum fögum',
                heiti: 'Frammistaða í hinu og þessu',
                vaegi: 0,
              },
            },
            {
              heiti: 'Stærðófræðó',
              dagsetning: new Date(1650, 1, 1),
              haefnieinkunn: 'Slæm',
              haefnieinkunnStada: 'F--',
              samtals: {
                heiti: 'bunrb',
                radeinkunn: {
                  einkunn: '3',
                  heiti: 'Raðeinkunn',
                  vaegi: 0,
                },
                grunnskolaeinkunn: {
                  einkunn: '8765',
                  heiti: 'Grunnskólaeinkunn',
                  vaegi: 0,
                },
              },
              framfaraTexti: {
                einkunn: 'Framfarir eru lit',
                heiti: 'Framfaratexti',
                vaegi: 0,
              },
              einkunnir: [
                {
                  heiti: 'Samlagning',
                  radeinkunn: {
                    einkunn: '88',
                    heiti: 'Samlagning, raðeinkunn',
                    vaegi: 97,
                  },
                  grunnskolaeinkunn: {
                    einkunn: '287692',
                    heiti: 'Samlagning, Grunnskólaeinkunn',
                    vaegi: 97,
                  },
                },
                {
                  heiti: 'Ekki gera vitlaust',
                  radeinkunn: {
                    einkunn: '89756',
                    heiti: 'Málnotkun, raðeinkunn',
                    vaegi: 64,
                  },
                  grunnskolaeinkunn: {
                    einkunn: '-7654',
                    heiti: 'Málnotkun, Grunnskólaeinkunn',
                    vaegi: 965,
                  },
                },
              ],
              ordOgTalnadaemi: {
                einkunn: 'L+elegt',
                heiti: 'Frekar',
                vaegi: 0,
              },
            },
          ],
        },
        {
          bekkur: 9,
          namsgreinar: [
            {
              heiti: 'Bíngó',
              dagsetning: new Date(1990, 1, 1),
              haefnieinkunn: 'Glæsó',
              haefnieinkunnStada: 'A+123',
              samtals: {
                heiti: 'goieo',
                radeinkunn: {
                  einkunn: '99',
                  heiti: 'Raðeinkunn',
                  vaegi: 0,
                },
                grunnskolaeinkunn: {
                  einkunn: '67',
                  heiti: 'Grunnskólaeinkunn',
                  vaegi: 0,
                },
              },
              framfaraTexti: {
                einkunn: 'Framfarir eru flottar og mikilvægar jibbí',
                heiti: 'Framfaratexti',
                vaegi: 0,
              },
              einkunnir: [
                {
                  heiti: 'Lesskilningur',
                  radeinkunn: {
                    einkunn: '896',
                    heiti: 'Lesskilningur, raðeinkunn',
                    vaegi: 97,
                  },
                  grunnskolaeinkunn: {
                    einkunn: '2',
                    heiti: 'Lesskilningur, Grunnskólaeinkunn',
                    vaegi: 97,
                  },
                },
                {
                  heiti: 'Málnotkun',
                  radeinkunn: {
                    einkunn: '896',
                    heiti: 'Málnotkun, raðeinkunn',
                    vaegi: 64,
                  },
                  grunnskolaeinkunn: {
                    einkunn: '2',
                    heiti: 'Málnotkun, Grunnskólaeinkunn',
                    vaegi: 965,
                  },
                },
              ],
              ordOgTalnadaemi: {
                einkunn: 'Bah',
                heiti: 'Hab',
                vaegi: 0,
              },
            },
          ],
        },
      ],
    }

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
          mockData.einkunnir,
        )
      }),
    )
  }
}
