import { User } from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'
import {
  StudentTrackDto,
  UniversityCareersClientService,
  UniversityId,
} from '@island.is/clients/university-careers'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { Locale } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import { Inject, Injectable } from '@nestjs/common'
import { mapToStudent, mapToStudentTrackModel } from './mapper'
import { StudentTrack } from './models/studentTrack.model'
import { StudentTrackHistory } from './models/studentTrackHistory.model'
import { StudentTrackTranscript } from './models/studentTrackTranscript.model'
import { StudentTrackTranscriptError } from './models/studentTrackTranscriptError.model'
import { UniversityIdMap } from '@island.is/clients/university-careers'

const LOG_CATEGORY = 'university-careers-api'
const FEATURE_FLAGS: Record<Exclude<UniversityId, 'hi'>, Features> = {
  unak: Features.isUniversityOfAkureyriEnabled,
  lbhi: Features.isAgriculturalUniversityOfIcelandEnabled,
  bifrost: Features.isBifrostUniversityEnabled,
  holar: Features.isHolarUniversityEnabled,
  lhi: Features.isIcelandUniversityOfTheArtsEnabled,
}

@Injectable()
export class UniversityCareersService {
  constructor(
    private universityCareers: UniversityCareersClientService,
    private readonly featureFlagService: FeatureFlagService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getStudentTrackHistory(
    user: User,
    locale: Locale,
  ): Promise<StudentTrackHistory | null> {
    const promises = Object.values(UniversityId).map(async (uni) => {
      return this.getStudentTrackHistoryByUniversity(user, uni, locale)
    })

    const transcripts: Array<StudentTrackTranscript> = []
    const errors: Array<StudentTrackTranscriptError> = []

    for (const resultArray of await Promise.allSettled(promises)) {
      if (resultArray.status === 'fulfilled' && resultArray.value) {
        const result = resultArray.value
        if (Array.isArray(result)) {
          transcripts.push(...result)
        } else {
          errors.push(result)
        }
      }
    }

    return {
      transcripts,
      errors,
    }
  }

  async getStudentTrackHistoryByUniversity(
    user: User,
    university: UniversityId,
    locale: Locale,
  ): Promise<
    Array<StudentTrackTranscript> | StudentTrackTranscriptError | null
  > {
    // TODO: REMOVE FEATURE FLAG LOGIC WHEN FULLY TESTED
    if (university !== 'hi') {
      const isUniversityAllowed = await this.featureFlagService.getValue(
        FEATURE_FLAGS[university],
        false,
        user,
      )
      if (!isUniversityAllowed) {
        return null
      }
    }
    const data: Array<StudentTrackDto> | StudentTrackTranscriptError | null =
      await this.universityCareers
        .getStudentTrackHistory(user, university, locale)
        .catch((e: Error | FetchError) => {
          this.logger.warn('Student track history fetch failed', {
            university,
            locale,
            error: e,
          })
          return {
            institution: {
              id: university,
              shortId: UniversityIdMap[university],
            },
            error: JSON.stringify(e),
          }
        })

    if (Array.isArray(data)) {
      return data
        .map((d) =>
          mapToStudent(d, {
            id: university,
            shortId: UniversityIdMap[university],
          }),
        )
        .filter(isDefined)
    }

    return data
  }

  async getStudentTrack(
    user: User,
    university: UniversityId,
    trackNumber: number,
    locale: Locale,
  ): Promise<StudentTrack | null> {
    const data = await this.universityCareers.getStudentTrack(
      user,
      trackNumber,
      university,
      locale,
    )

    if (!data?.transcript) {
      this.logger.info('No transcript data found', {
        category: LOG_CATEGORY,
        university,
      })
      return null
    }

    return (
      mapToStudentTrackModel(data, {
        id: university,
        shortId: UniversityIdMap[university],
      }) ?? null
    )
  }
}
