import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { DefaultApi } from '../../gen/fetch'

export class FinanceClientV2Service {
  constructor(private readonly defaultApi: DefaultApi) {}

  private apiWithAuth = (user: User) =>
    this.defaultApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getAssessmentYears(user: User) {
    const data = await this.apiWithAuth(user).assessmentYearsnationalIdGET1({
      nationalId: user.nationalId,
    })
    return data.resultYears ?? null
  }

  async getChargeTypesByYear(user: User, year: string) {
    const data = await this.apiWithAuth(
      user,
    ).chargeTypesByYearnationalIdassessmentYearGET2({
      nationalId: user.nationalId,
      assessmentYear: year,
    })
    return data?.resultChargeTypeByYear ?? null
  }

  async getChargeTypesDetailsByYear(
    user: User,
    assessmentYear: string,
    chargeTypeID: string,
  ) {
    const data = await this.apiWithAuth(
      user,
    ).chargeTypesDetailsByYearnationalIdassessmentYearchargeTypeIDGET3({
      nationalId: user.nationalId,
      assessmentYear,
      chargeTypeID,
    })
    return data?.resultChargeTypeDetails ?? null
  }

  async getChargeItemSubjectsByYear(
    user: User,
    assessmentYear: string,
    chargeTypeID: string,
    nextKey?: string,
  ) {
    const data = await this.apiWithAuth(
      user,
    ).chargeItemSubjectsByYearnationalIdassessmentYearchargeTypeIDGET4({
      nationalId: user.nationalId,
      assessmentYear,
      chargeTypeID,
      nextKey,
    })
    return data?.resultSubjectsByYearChargeType ?? null
  }

  async getChargeTypePeriodSubject(
    user: User,
    assessmentYear: string,
    chargeTypeID: string,
    chargeItemSubject: string,
    period: string,
  ) {
    const data = await this.apiWithAuth(
      user,
    ).recordsByYearnationalIdassessmentYearchargeTypeIDchargeItemSubjectperiodGET5(
      {
        nationalId: user.nationalId,
        assessmentYear,
        chargeTypeID,
        chargeItemSubject,
        period,
      },
    )
    return data?.resultRecordsByChargeTypePeriodSubject ?? null
  }
}
