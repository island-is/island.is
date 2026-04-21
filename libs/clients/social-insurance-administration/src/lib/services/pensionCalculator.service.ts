import { Injectable } from '@nestjs/common'
import {
  PensionCalculatorApi,
  ApiProtectedV1PensionCalculatorPostRequest,
} from '../../../gen/fetch/v1'

@Injectable()
export class SocialInsuranceAdministrationPensionCalculatorService {
  constructor(private readonly pensionCalculatorApi: PensionCalculatorApi) {}

  async getPensionCalculation(
    parameters: ApiProtectedV1PensionCalculatorPostRequest['trWebCommonsExternalPortalsApiModelsPensionCalculatorPensionCalculatorInput'],
  ) {
    return this.pensionCalculatorApi.apiProtectedV1PensionCalculatorPost({
      trWebCommonsExternalPortalsApiModelsPensionCalculatorPensionCalculatorInput:
        parameters,
    })
  }
}
