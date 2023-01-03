import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { VehicleOwnerChangeClient } from '@island.is/clients/transport-authority/vehicle-owner-change'
import { OwnerChangeAnswers } from './graphql/dto'
import { OwnerChangeValidation } from './graphql/models'

@Injectable()
export class TransportAuthorityApi {
  constructor(
    private readonly vehicleOwnerChangeClient: VehicleOwnerChangeClient,
  ) {}

  async validateApplicationForOwnerChange(
    user: User,
    answers: OwnerChangeAnswers,
  ): Promise<OwnerChangeValidation | null> {
    // No need to continue with this validation in user is neither seller nor buyer
    // (only time application data changes is on state change from these roles)
    const sellerSsn = answers?.seller?.nationalId
    const buyerSsn = answers?.buyer?.nationalId
    if (user.nationalId !== sellerSsn && user.nationalId !== buyerSsn) {
      return null
    }

    const buyerCoOwners = answers?.buyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'coOwner',
    )
    const buyerOperators = answers?.buyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'operator',
    )

    const result = await this.vehicleOwnerChangeClient.validateAllForOwnerChange(
      user,
      {
        permno: answers?.vehicle?.plate,
        seller: {
          ssn: sellerSsn,
          email: answers?.seller?.email,
        },
        buyer: {
          ssn: buyerSsn,
          email: answers?.buyer?.email,
        },
        dateOfPurchase: new Date(answers?.vehicle?.date),
        saleAmount: Number(answers?.vehicle?.salePrice || '0') || 0,
        insuranceCompanyCode: answers?.insurance?.value || '',
        coOwners: buyerCoOwners?.map((coOwner) => ({
          ssn: coOwner.nationalId,
          email: coOwner.email,
        })),
        operators: buyerOperators?.map((operator) => ({
          ssn: operator.nationalId,
          email: operator.email,
          isMainOperator:
            buyerOperators.length > 1
              ? operator.nationalId === answers?.buyerMainOperator?.nationalId
              : true,
        })),
      },
    )

    return result
  }
}
