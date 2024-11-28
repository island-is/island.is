import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { NamskeidApi } from '../../gen/fetch'
import { Seminar } from './seminars.types'

@Injectable()
export class SeminarsClientService {
  constructor(private readonly namskeidApi: NamskeidApi) {}

  private namskeidApiWithAuth = (user: User) =>
    this.namskeidApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getSeminars(auth: User): Promise<Array<Seminar>> {
    const result = await this.namskeidApiWithAuth(auth).apiNamskeidGet()
    return result.map((seminar) => ({
      alwaysOpen: seminar.alltafOpid,
      dateFrom: seminar.dagsFra,
      dateTo: seminar.dagsTil,
      category: seminar.flokkur,
      descriptionUrl: seminar.lysingAVef,
      name: seminar.nafn,
      seminarId: seminar.namskeidID,
      registrationUrl: seminar.skraningarslod,
      status: seminar.stada,
      location: seminar.stadsetning,
      time: seminar.timi,
      subCategory: seminar.undirflokkur,
      price: seminar.verd,
    }))
  }
}
