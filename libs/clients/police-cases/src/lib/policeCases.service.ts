import { Injectable } from "@nestjs/common";
import { CasesDto, MittLogreglanAPIApi } from "../../gen/fetch";
import { Auth, AuthMiddleware, User } from "@island.is/auth-nest-tools";

@Injectable()
export class PoliceCasesClientService {
  constructor(
    private casesApi: MittLogreglanAPIApi,
  ) { }

  private casesApiWithAuth = (user: User) =>
    this.casesApi.withMiddleware(new AuthMiddleware(user as Auth))

  public getCases = (user: User): Promise<CasesDto> => this.casesApiWithAuth(user).apiGetcasesSocialsecuritynumberGet({ socialsecuritynumber: user.nationalId })
}
