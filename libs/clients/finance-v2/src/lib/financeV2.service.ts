import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  AssessmentYearsnationalIdGET1Request,
  ChargeItemSubjectsByYearnationalIdassessmentYearchargeTypeIDGET4Request,
  ChargeTypesByYearnationalIdassessmentYearGET2Request,
  ChargeTypesDetailsByYearnationalIdassessmentYearchargeTypeIDGET3Request,
  DefaultApi,
  RecordsByYearnationalIdassessmentYearchargeTypeIDchargeItemSubjectperiodGET5Request,
} from '../../gen/fetch'

@Injectable()
export class FinanceClientV2Service {
  constructor(private readonly defaultApi: DefaultApi) {}

  private apiWithAuth = (user: User) =>
    this.defaultApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getAssessmentYears(
    user: User,
    input: AssessmentYearsnationalIdGET1Request,
  ) {
    const data = await this.apiWithAuth(user).assessmentYearsnationalIdGET1(
      input,
    )
    return data?.resultYears ?? null
  }

  async getChargeTypesByYear(
    user: User,
    input: ChargeTypesByYearnationalIdassessmentYearGET2Request,
  ) {
    const data = await this.apiWithAuth(
      user,
    ).chargeTypesByYearnationalIdassessmentYearGET2(input)
    return data?.resultChargeTypeByYear ?? null
  }

  async getChargeTypesDetailsByYear(
    user: User,
    input: ChargeTypesDetailsByYearnationalIdassessmentYearchargeTypeIDGET3Request,
  ) {
    const data = await this.apiWithAuth(
      user,
    ).chargeTypesDetailsByYearnationalIdassessmentYearchargeTypeIDGET3(input)
    return data?.resultChargeTypeDetails ?? null
  }

  async getChargeItemSubjectsByYear(
    user: User,
    input: ChargeItemSubjectsByYearnationalIdassessmentYearchargeTypeIDGET4Request,
  ) {
    const data = await this.apiWithAuth(
      user,
    ).chargeItemSubjectsByYearnationalIdassessmentYearchargeTypeIDGET4(input)
    return data?.resultSubjectsByYearChargeType ?? null
  }

  async getChargeTypePeriodSubject(
    user: User,
    input: RecordsByYearnationalIdassessmentYearchargeTypeIDchargeItemSubjectperiodGET5Request,
  ) {
    const data = await this.apiWithAuth(
      user,
    ).recordsByYearnationalIdassessmentYearchargeTypeIDchargeItemSubjectperiodGET5(
      input,
    )
    return data?.resultRecordsByChargeTypePeriodSubject ?? null
  }
}
