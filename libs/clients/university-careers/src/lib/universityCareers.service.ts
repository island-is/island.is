import { Inject, Injectable } from '@nestjs/common'
import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { Locale } from '@island.is/shared/types'
import { dataOr404Null } from '@island.is/clients/middlewares'
import { isDefined } from '@island.is/shared/utils'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import type { Client } from '../../gen/fetch/client'
import {
  StudentTrackDto,
  mapToStudentTrackDto,
  StudentTrackOverviewDto,
  mapToStudentTrackOverviewDto,
} from './dto'
import { StudyType, UniversityId } from './universityCareers.types'
import { nemandiGet, nemandiFerillGet } from '../../gen/fetch'

export type UniversityClientMap = Map<UniversityId, Client>

@Injectable()
export class UniversityCareersClientService {
  constructor(
    @Inject('test')
    private readonly clients: UniversityClientMap,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private getClient = (university: UniversityId): Client => {
    const apiClient = this.clients.get(university)
    if (!apiClient) {
      throw new Error(`No client configured for university: ${university}`)
    }
    return apiClient
  }

  getStudentTrackHistory = async (
    user: User,
    university: UniversityId,
    locale?: Locale,
    studyType?: StudyType,
  ): Promise<Array<StudentTrackDto> | null> => {
    const apiClient = this.getClient(university)

    const data = await withAuthContext(user, () =>
      dataOr404Null(
        nemandiGet({
          client: apiClient,
          query: {
            locale: locale === 'en' ? 'en' : 'is',
            ...(studyType !== undefined && { tegund_nams: studyType }),
          },
        }),
      ),
    )

    if (!data) {
      return null
    }

    const transcripts =
      data.transcripts
        ?.map((t) => mapToStudentTrackDto(t, university))
        .filter(isDefined) ?? []

    if (!transcripts.length) {
      this.logger.info('No transcripts found for user', { university })
    }
    return transcripts
  }

  getStudentTrack = async (
    user: User,
    trackNumber: number,
    university: UniversityId,
    locale?: Locale,
  ): Promise<StudentTrackOverviewDto | null> => {
    const apiClient = this.getClient(university)

    const data = await withAuthContext(user, () =>
      dataOr404Null(
        nemandiFerillGet({
          client: apiClient,
          path: { ferill: trackNumber },
          query: { locale: locale === 'en' ? 'en' : 'is' },
        }),
      ),
    )

    if (!data) {
      return null
    }

    return mapToStudentTrackOverviewDto(data, university)
  }

  downloadFile = async (
    user: User,
    fileUrl: string,
    university: UniversityId,
  ): Promise<Blob | null> => {
    const result = await withAuthContext(user, () =>
      dataOr404Null(
        this.getClient(university).get({ url: fileUrl, parseAs: 'blob' }),
      ),
    )
    return result instanceof Blob ? result : null
  }
}
