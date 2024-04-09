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
import {
  UniversityCareerService,
  UniversityId,
} from './universityCareers.types'
import { handle404 } from '@island.is/clients/middlewares'
import { isDefined } from '@island.is/shared/utils'
import { StudentTrackOverviewDto } from './dto/studentTrackOverviewDto'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { OrganizationSlugType } from '@island.is/shared/constants'

@Injectable()
export class UniversityCareersClientService implements UniversityCareerService {
  constructor(
    private readonly lbhiApi: LbhiApi,
    private readonly unakApi: UnakApi,
    private readonly holarApi: HolarApi,
    private readonly bifrostApi: BifrostApi,
    private readonly hiApi: HIApi,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  getOrganizationSlugType = (
    type: UniversityId,
  ): OrganizationSlugType | undefined => {
    switch (type) {
      case UniversityId.UNIVERSITY_OF_ICELAND:
        return 'haskoli-islands'
      case UniversityId.HOLAR_UNIVERSITY:
        return 'holaskoli-haskolinn-a-holum'
      case UniversityId.UNIVERSITY_OF_AKUREYRI:
        return 'haskolinn-a-akureyri'
      case UniversityId.BIFROST_UNIVERSITY:
        return 'bifrost'
      case UniversityId.AGRICULTURAL_UNIVERSITY_OF_ICELAND:
        return 'landbunadarhaskoli-islands'
      default:
        return undefined
    }
  }

  getUniversityByOrganizationSlug = (
    slug: OrganizationSlugType,
  ): UniversityId | undefined => {
    switch (slug) {
      case 'haskoli-islands':
        return UniversityId.UNIVERSITY_OF_ICELAND
      case 'holaskoli-haskolinn-a-holum':
        return UniversityId.HOLAR_UNIVERSITY
      case 'haskolinn-a-akureyri':
        return UniversityId.UNIVERSITY_OF_AKUREYRI
      case 'bifrost':
        return UniversityId.BIFROST_UNIVERSITY
      case 'landbunadarhaskoli-islands':
        return UniversityId.AGRICULTURAL_UNIVERSITY_OF_ICELAND
      default:
        return undefined
    }
  }

  getApi = (
    type: UniversityId,
    user: User,
  ): {
    api: LbhiApi | UnakApi | HolarApi | BifrostApi | HIApi
    locales: {
      studentLocale:
        | typeof UnakLocale
        | typeof LbhiLocale
        | typeof BifrostLocale
        | typeof HolarLocale
        | typeof HILocale
      studentTranscriptLocale:
        | typeof UnakTranscriptLocale
        | typeof LbhiTranscriptLocale
        | typeof BifrostTranscriptLocale
        | typeof HolarTranscriptLocale
        | typeof HITranscriptLocale
      studentTrackLocale:
        | typeof UnakFerillLocale
        | typeof LbhiFerillLocale
        | typeof BifrostFerillLocale
        | typeof HolarFerillLocale
        | typeof HIFerillLocale
    }
  } => {
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

    return (
      data.transcripts?.map((t) => mapToStudentTrackDto(t)).filter(isDefined) ??
      []
    )
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
        ? mapToStudentTrackDto(data.transcript) ?? undefined
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
