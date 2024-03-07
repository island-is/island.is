import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  NemandiFerillFerillFileTranscriptGetLocaleEnum,
  NemandiFerillFerillGetLocaleEnum,
  NemandiGetLocaleEnum,
  StudentTrackOverview,
  StudentTranscriptApi,
  Transcripts,
} from '../../gen/fetch'
import { handle404 } from '@island.is/clients/middlewares'

@Injectable()
export class UniversityOfIcelandService {
  constructor(private readonly api: StudentTranscriptApi) {}

  private apiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  studentInfo = (
    user: User,
    locale?: NemandiGetLocaleEnum,
  ): Promise<Transcripts | null> =>
    this.apiWithAuth(user)
      .nemandiGet({
        locale: locale,
      })
      .catch(handle404)

  studentCareer = (
    user: User,
    trackNumber: number,
    locale?: NemandiFerillFerillGetLocaleEnum,
  ): Promise<StudentTrackOverview | null> =>
    this.apiWithAuth(user)
      .nemandiFerillFerillGet({
        ferill: trackNumber,
        locale: locale,
      })
      .catch(handle404)

  studentCareerPDF = (
    user: User,
    trackNumber: number,
    locale?: NemandiFerillFerillFileTranscriptGetLocaleEnum,
  ): Promise<Blob | null> =>
    this.apiWithAuth(user)
      .nemandiFerillFerillFileTranscriptGet({
        ferill: trackNumber,
        locale: locale,
      })
      .catch(handle404)
}
