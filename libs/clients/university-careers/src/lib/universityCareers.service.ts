import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Inject, Injectable } from '@nestjs/common'
import {
  BifrostApi,
  BifrostFerillLocale,
  BifrostLocale,
  BifrostTranscriptLocale,
  HIApi,
  HIFerillLocale,
  HILocale,
  HITranscriptLocale,
  HolarApi,
  HolarFerillLocale,
  HolarLocale,
  HolarTranscriptLocale,
  LHIApi,
  LHIFerillLocale,
  LHILocale,
  LHITranscriptLocale,
  LbhiApi,
  LbhiFerillLocale,
  LbhiLocale,
  LbhiTranscriptLocale,
  UnakApi,
  UnakFerillLocale,
  UnakLocale,
  UnakTranscriptLocale,
} from './clients'
import { StudentTrackDto, mapToStudentTrackDto } from './dto/studentTrackDto'
import { Locale } from '@island.is/shared/types'
import { UniversityId } from './universityCareers.types'
import { handle404 } from '@island.is/clients/middlewares'
import { isDefined } from '@island.is/shared/utils'
import { StudentTrackOverviewDto } from './dto/studentTrackOverviewDto'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { UniversityDto } from './dto/universityDto'

@Injectable()
export class UniversityCareersClientService {
  constructor(
    private readonly lbhiApi: LbhiApi,
    private readonly unakApi: UnakApi,
    private readonly holarApi: HolarApi,
    private readonly bifrostApi: BifrostApi,
    private readonly hiApi: HIApi,
    private readonly lhiApi: LHIApi,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private getApi = (type: UniversityId, user: User): UniversityDto => {
    switch (type) {
      case UniversityId.AGRICULTURAL_UNIVERSITY_OF_ICELAND:
        return {
          api: this.lbhiApi.withMiddleware(new AuthMiddleware(user as Auth)),
          locales: {
            studentLocale: LbhiLocale,
            studentTranscriptLocale: LbhiTranscriptLocale,
            studentTrackLocale: LbhiFerillLocale,
          },
        }
      case UniversityId.BIFROST_UNIVERSITY:
        return {
          api: this.bifrostApi.withMiddleware(new AuthMiddleware(user as Auth)),
          locales: {
            studentLocale: BifrostLocale,
            studentTranscriptLocale: BifrostTranscriptLocale,
            studentTrackLocale: BifrostFerillLocale,
          },
        }
      case UniversityId.HOLAR_UNIVERSITY:
        return {
          api: this.holarApi.withMiddleware(new AuthMiddleware(user as Auth)),
          locales: {
            studentLocale: HolarLocale,
            studentTranscriptLocale: HolarTranscriptLocale,
            studentTrackLocale: HolarFerillLocale,
          },
        }
      case UniversityId.UNIVERSITY_OF_AKUREYRI:
        return {
          api: this.unakApi.withMiddleware(new AuthMiddleware(user as Auth)),
          locales: {
            studentLocale: UnakLocale,
            studentTranscriptLocale: UnakTranscriptLocale,
            studentTrackLocale: UnakFerillLocale,
          },
        }
      case UniversityId.UNIVERSITY_OF_ICELAND:
        return {
          api: this.hiApi.withMiddleware(new AuthMiddleware(user as Auth)),
          locales: {
            studentLocale: HILocale,
            studentTranscriptLocale: HITranscriptLocale,
            studentTrackLocale: HIFerillLocale,
          },
        }
      case UniversityId.ICELAND_UNIVERSITY_OF_THE_ARTS:
        return {
          api: this.lhiApi.withMiddleware(new AuthMiddleware(user as Auth)),
          locales: {
            studentLocale: LHILocale,
            studentTranscriptLocale: LHITranscriptLocale,
            studentTrackLocale: LHIFerillLocale,
          },
        }
    }
  }

  getStudentTrackHistory = async (
    user: User,
    university: UniversityId,
    locale?: Locale,
  ): Promise<Array<StudentTrackDto> | null> => {
    const { api, locales } = this.getApi(university, user)
    const data = await api
      .nemandiGet({
        locale:
          locale === 'en' ? locales.studentLocale.En : locales.studentLocale.Is,
      })
      .catch(handle404)

    if (!data) {
      return null
    }

    const transcripts =
      data.transcripts
        ?.map((t) => mapToStudentTrackDto(t, university))
        .filter(isDefined) ?? []

    if (!transcripts.length) {
      this.logger.info('No transcripts found for user', {
        university,
      })
    }
    return transcripts
  }

  getStudentTrack = async (
    user: User,
    trackNumber: number,
    university: UniversityId,
    locale?: Locale,
  ): Promise<StudentTrackOverviewDto | null> => {
    const { api, locales } = this.getApi(university, user)
    const data = await api
      .nemandiFerillFerillGet({
        ferill: trackNumber,
        locale:
          locale === 'en'
            ? locales.studentTrackLocale.En
            : locales.studentTrackLocale.Is,
      })
      .catch(handle404)

    if (!data) {
      return null
    }

    return {
      transcript: data.transcript
        ? mapToStudentTrackDto(data.transcript, university) ?? undefined
        : undefined,
      files: data.files?.map((d) => ({ ...d })),
      body: { ...data.body },
    }
  }

  getStudentTrackPdf = async (
    user: User,
    trackNumber: number,
    university: UniversityId,
    locale?: Locale,
  ): Promise<Blob | null> => {
    const { api, locales } = this.getApi(university, user)
    return api
      .nemandiFerillFerillFileTranscriptGet({
        ferill: trackNumber,
        locale:
          locale === 'en'
            ? locales.studentTranscriptLocale.En
            : locales.studentTranscriptLocale.Is,
      })
      .catch(handle404)
  }
}
