import { User } from '@island.is/auth-nest-tools'
import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import {
  StudentTrackDto,
  UniversityCareersClientService,
  UniversityId,
} from '@island.is/clients/university-careers'
import { isDefined } from '@island.is/shared/utils'
import { Locale } from '@island.is/shared/types'
import { mapToStudent } from './mapper'
import { StudentTrackTranscriptError } from './models/studentTrackTranscriptError.model'
import { StudentTrackTranscript } from './models/studentTrackTranscript.model'
import { FetchError } from '@island.is/clients/middlewares'

@Injectable()
export class UniversityCareersService {
  constructor(
    private universityCareers: UniversityCareersClientService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getStudentTrackHistoryByUniversity(
    user: User,
    university: UniversityId,
    locale: Locale,
  ): Promise<
    Array<StudentTrackTranscript> | StudentTrackTranscriptError | null
  > {
    const data: Array<StudentTrackDto> | StudentTrackTranscriptError | null =
      await this.universityCareers
        .getStudentTrackHistory(user, university, locale)
        .catch((e: Error | FetchError) => {
          return { university, error: JSON.stringify(e) }
        })

    if (Array.isArray(data)) {
      return data.map((d) => mapToStudent(d)).filter(isDefined)
    }

    return data
  }

  async getStudentTrack(
    user: User,
    university: UniversityId,
    trackNumber: number,
    locale?: Locale,
  ) {
    return this.universityCareers.getStudentTrack(
      user,
      trackNumber,
      university,
      locale,
    )
  }
}
