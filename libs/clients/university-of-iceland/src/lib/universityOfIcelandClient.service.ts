import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  StudentTranscriptApi,
  NemandiGetLocaleEnum,
  Transcripts,
  NemandiFerillFerillGetLocaleEnum,
  StudentTrackOverview,
  NemandiFerillFerillFileTranscriptGetLocaleEnum,
} from '../../gen/fetch'
import { handle404 } from '@island.is/clients/middlewares'

@Injectable()
export class UniversityOfIcelandService {
  constructor(private readonly universityOfIcelandApi: StudentTranscriptApi) {}

  private universityOfIcelandApiWithAuth = (user: User) =>
    this.universityOfIcelandApi.withMiddleware(new AuthMiddleware(user as Auth))

  studentInfo = (
    user: User,
    locale?: NemandiGetLocaleEnum,
  ): Promise<Transcripts | null> =>
    this.universityOfIcelandApiWithAuth(user)
      .nemandiGet({
        locale: locale,
      })
      .catch(handle404)

  studentCareer = (
    user: User,
    trackNumber: number,
    locale?: NemandiFerillFerillGetLocaleEnum,
  ): Promise<StudentTrackOverview | null> =>
    this.universityOfIcelandApiWithAuth(user)
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
    this.universityOfIcelandApiWithAuth(user)
      .nemandiFerillFerillFileTranscriptGet({
        ferill: trackNumber,
        locale: locale,
      })
      .catch(handle404)
}
