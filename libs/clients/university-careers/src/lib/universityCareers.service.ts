import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
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

@Injectable()
export class UniversityCareersClientService implements UniversityCareerService {
  constructor(
    private readonly lbhiApi: LbhiApi,
    private readonly unakApi: UnakApi,
    private readonly holarApi: HolarApi,
    private readonly bifrostApi: BifrostApi,
    private readonly hiApi: HIApi,
  ) {}

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
      case UniversityId.AgriculturalUniversityOfIceland:
        return {
          api: this.lbhiApi.withMiddleware(new AuthMiddleware(user as Auth)),
          locales: {
            studentLocale: LbhiLocale,
            studentTranscriptLocale: LbhiTranscriptLocale,
            studentTrackLocale: LbhiFerillLocale,
          },
        }
      case UniversityId.BifrostUniversity:
        return {
          api: this.bifrostApi.withMiddleware(new AuthMiddleware(user as Auth)),
          locales: {
            studentLocale: BifrostLocale,
            studentTranscriptLocale: BifrostTranscriptLocale,
            studentTrackLocale: BifrostFerillLocale,
          },
        }
      case UniversityId.HolarUniversity:
        return {
          api: this.holarApi.withMiddleware(new AuthMiddleware(user as Auth)),
          locales: {
            studentLocale: HolarLocale,
            studentTranscriptLocale: HolarTranscriptLocale,
            studentTrackLocale: HolarFerillLocale,
          },
        }
      case UniversityId.UniversityOfAkureyri:
        return {
          api: this.unakApi.withMiddleware(new AuthMiddleware(user as Auth)),
          locales: {
            studentLocale: UnakLocale,
            studentTranscriptLocale: UnakTranscriptLocale,
            studentTrackLocale: UnakFerillLocale,
          },
        }
      case UniversityId.UniversityOfIceland:
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

  getStudentInfo = async (
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

  getStudentCareer = async (
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

  getStudentCareerPdf = async (
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
