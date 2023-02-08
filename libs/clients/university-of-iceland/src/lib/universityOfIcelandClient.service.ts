import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  DefaultApi,
  NemandiFerillFerillFileTranscriptGetLocaleEnum,
  NemandiFerillFerillGetLocaleEnum,
  NemandiGetLocaleEnum,
} from '../../gen/fetch'

@Injectable()
export class UniversityOfIcelandService {
  constructor(private readonly universityOfIcelandApi: DefaultApi) {}

  private universityOfIcelandApiWithAuth = (user: User) =>
    this.universityOfIcelandApi.withMiddleware(new AuthMiddleware(user as Auth))

  async studentInfo(
    user: User,
    locale?: NemandiGetLocaleEnum,
  ): Promise<object> {
    return await this.universityOfIcelandApiWithAuth(user).nemandiGet({
      locale: locale,
    })
  }
  async studentCareer(
    user: User,
    trackNumber: number,
    locale?: NemandiFerillFerillGetLocaleEnum,
  ): Promise<object> {
    return await this.universityOfIcelandApiWithAuth(
      user,
    ).nemandiFerillFerillGet({
      ferill: trackNumber,
      locale: locale,
    })
  }

  async studentCareerPDF(
    user: User,
    trackNumber: number,
    locale?: NemandiFerillFerillFileTranscriptGetLocaleEnum,
  ): Promise<Blob> {
    return await this.universityOfIcelandApiWithAuth(
      user,
    ).nemandiFerillFerillFileTranscriptGet({
      ferill: trackNumber,
      locale: locale,
    })
  }
}
