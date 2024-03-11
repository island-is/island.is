import { User } from '@island.is/auth-nest-tools'
import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import {
  UniversityCareersClientService,
  UniversityId,
} from '@island.is/clients/university-careers'
import { isDefined } from '@island.is/shared/utils'
import { Locale } from '@island.is/shared/types'
import { mapToStudent } from './mapper'
import { StudentTrackTranscript } from './models/studentTrackTranscript.model'

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
  ): Promise<Array<StudentTrackTranscript> | null> {
    const data = await this.universityCareers.getStudentTrackHistory(
      user,
      university,
      locale,
    )

    return data?.map((d) => mapToStudent(d)).filter(isDefined) ?? null
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
