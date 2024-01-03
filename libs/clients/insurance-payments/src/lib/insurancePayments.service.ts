import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { Inject } from '@nestjs/common'
import {
  ApplicantApi,
  ApplicationApi,
  DocumentsApi,
  GeneralApi,
  PaymentPlanApi,
  ValidationApi,
} from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

export class InsurancePaymentsClientService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private applicantApi: ApplicantApi,
    private applicationApi: ApplicationApi,
    private documentsApi: DocumentsApi,
    private generalApi: GeneralApi,
    private validationApi: ValidationApi,
    private paymentPlanApi: PaymentPlanApi,
  ) {}

  private paymentPlanWithAuth = (user: User) =>
    this.paymentPlanApi.withMiddleware(new AuthMiddleware(user as Auth))

  getPaymentPlan(user: User) {
    return this.paymentPlanWithAuth(user).apiProtectedV1PaymentPlanGet({})
  }
}
