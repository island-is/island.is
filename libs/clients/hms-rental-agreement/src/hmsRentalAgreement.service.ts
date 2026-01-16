import { Inject, Injectable } from '@nestjs/common'
import { HomeApi } from '../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { isDefined } from '@island.is/shared/utils'
import {
  mapRentalAgreementDto,
  RentalAgreementDto,
} from './dtos/rentalAgreements.dto'
import { INACTIVE_AGREEMENT_STATUSES } from './constants'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class HmsRentalAgreementService {
  constructor(
    private readonly api: HomeApi,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private apiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  async getRentalAgreements(
    user: User,
    hideInactiveAgreements = false,
  ): Promise<RentalAgreementDto[]> {
    const res = await this.apiWithAuth(user).contractKtKtGet({
      kt: user.nationalId,
    })

    const data = res.map(mapRentalAgreementDto).filter(isDefined)
    if (hideInactiveAgreements) {
      return data.filter((d) => !INACTIVE_AGREEMENT_STATUSES.includes(d.status))
    }
    return data
  }

  async getRentalAgreement(
    user: User,
    id: number,
  ): Promise<RentalAgreementDto | undefined> {
    const agreements = await this.getRentalAgreements(user)
    const agreementToReturn: RentalAgreementDto | undefined = agreements.find(
      (agreement) => agreement.id === id,
    )

    if (!agreementToReturn) {
      this.logger.info('Rental agreement not found', {
        id,
      })
      return
    }

    return agreementToReturn
  }

  /*async getRentalAgreementPdf(user: User, id: number): Promise<Buffer> {
    const agreement = await this.getRentalAgreement(user, id)
    if (!agreement) {
      throw new NotFoundException('Rental agreement not found')
    }

    const res = await this.apiWithAuth(user).contractKtKtWithDocumentsGet({
      kt: user.nationalId,
    })

    const pdfs =
      res
        .filter((res) => res.contract?.contractId === id)
        .flatMap((r) => r.documents)
        .filter(isDefined) ?? undefined

    return res
  }*/
}
