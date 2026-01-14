import { Injectable, NotFoundException } from '@nestjs/common'
import { HomeApi } from '../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { isDefined } from '@island.is/shared/utils'
import {
  mapRentalAgreementDto,
  RentalAgreementDto,
} from './dtos/rentalAgreements.dto'

@Injectable()
export class HmsRentalAgreementService {
  constructor(private readonly api: HomeApi) {}

  private apiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  async getRentalAgreements(user: User): Promise<RentalAgreementDto[]> {
    const res = await this.apiWithAuth(user).contractKtKtGet({
      kt: user.nationalId,
    })
    return res.map(mapRentalAgreementDto).filter(isDefined)
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
      throw new NotFoundException('Rental agreement not found')
    }

    return agreementToReturn
  }
}
