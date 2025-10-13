import { Injectable } from '@nestjs/common'
import { MittLogreglanAPIApi } from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { mapCaseDto, PoliceCaseDto } from './dtos/policeCase.dto'
import { handle404 } from '@island.is/clients/middlewares'

@Injectable()
export class PoliceCasesClientService {
  constructor(private casesApi: MittLogreglanAPIApi) {}

  private casesApiWithAuth = (user: User) =>
    this.casesApi.withMiddleware(new AuthMiddleware(user as Auth))

  public getCases = async (user: User): Promise<PoliceCaseDto[]> => {
    const response = await this.casesApiWithAuth(
      user,
    ).apiGetcasesSocialsecuritynumberGet({
      socialsecuritynumber: user.nationalId,
    }).catch(handle404)

    if (!response || !response.cases) {
      return []
    }

    return response.cases.map(mapCaseDto)
  }
}
