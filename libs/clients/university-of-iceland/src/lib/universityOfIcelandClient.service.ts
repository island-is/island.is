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

@Injectable()
export class UniversityOfIcelandService {
  constructor(private readonly universityOfIcelandApi: StudentTranscriptApi) {}

  private universityOfIcelandApiWithAuth = (user: User) =>
    this.universityOfIcelandApi.withMiddleware(new AuthMiddleware(user as Auth))

  studentInfo(user: User, locale?: NemandiGetLocaleEnum): Promise<Transcripts> {
    return this.universityOfIcelandApiWithAuth(user).nemandiGet({
      locale: locale,
    })
  }
  studentCareer(
    user: User,
    trackNumber: number,
    locale?: NemandiFerillFerillGetLocaleEnum,
  ): Promise<StudentTrackOverview> {
    return this.universityOfIcelandApiWithAuth(user).nemandiFerillFerillGet({
      ferill: trackNumber,
      locale: locale,
    })
  }

  studentCareerPDF(
    user: User,
    trackNumber: number,
    locale?: NemandiFerillFerillFileTranscriptGetLocaleEnum,
  ): Promise<Blob> {
    return this.universityOfIcelandApiWithAuth(
      user,
    ).nemandiFerillFerillFileTranscriptGet({
      ferill: trackNumber,
      locale: locale,
    })
  }
}
