import { Injectable } from '@nestjs/common'
import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { mapCaseDto, PoliceCaseDto } from './dtos/policeCase.dto'
import { dataOr404Null } from '@island.is/clients/middlewares'
import { getApiGetcasesBySocialsecuritynumber } from '../../gen/fetch'

@Injectable()
export class PoliceCasesClientService {
  public getCases = async (user: User): Promise<PoliceCaseDto[]> => {
    const response = await withAuthContext(user, () =>
      dataOr404Null(
        getApiGetcasesBySocialsecuritynumber({
          path: { socialsecuritynumber: user.nationalId },
        }),
      ),
    )

    if (!response || !response.cases) {
      return []
    }

    return response.cases.map(mapCaseDto)
  }
}
