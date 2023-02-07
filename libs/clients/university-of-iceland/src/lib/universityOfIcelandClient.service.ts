import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  DefaultApi,
  NemandiKtFerillFerillFileTranscriptGetLocaleEnum,
  NemandiKtGetLocaleEnum,
  NemandiKtFerillFerillGetLocaleEnum,
} from '../../gen/fetch'

@Injectable()
export class UniversityOfIcelandService {
  constructor(private readonly universityOfIcelandApi: DefaultApi) {}

  private universityOfIcelandApiWithAuth = (user: User) =>
    this.universityOfIcelandApi.withMiddleware(new AuthMiddleware(user as Auth))

  async studentInfo(
    user: User,
    locale?: NemandiKtGetLocaleEnum,
  ): Promise<object> {
    return await this.universityOfIcelandApiWithAuth(user).nemandiKtGet({
      kt: user.nationalId,
      locale: locale,
    })
  }
  async studentCareer(
    user: User,
    trackNumber: number,
    locale?: NemandiKtFerillFerillGetLocaleEnum,
  ): Promise<object> {
    return await this.universityOfIcelandApiWithAuth(
      user,
    ).nemandiKtFerillFerillGet({
      ferill: trackNumber,
      kt: user.nationalId,
      locale: locale,
    })
  }

  async studentCareerPDF(
    user: User,
    trackNumber: number,
    locale?: NemandiKtFerillFerillFileTranscriptGetLocaleEnum,
  ): Promise<Blob> {
    return await this.universityOfIcelandApiWithAuth(
      user,
    ).nemandiKtFerillFerillFileTranscriptGet({
      ferill: trackNumber,
      kt: user.nationalId,
      locale: locale,
    })
  }
}
