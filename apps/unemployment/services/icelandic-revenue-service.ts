import { TaxPayerInformation } from '../entities/user'
import { mockAsync } from '../utils/service-utils'
import { MockUser } from './user.service'

export class IcelandicRevenueService {
  public getCurrentPersonalTaxCredit = () => {
    return mockAsync(50792)
  }

  public getTaxBracketPercentage: (
    taxBracketNumber: 1 | 2 | 3,
  ) => Promise<number> = (taxBracketNumber) => {
    return mockAsync(() => {
      const taxBracketPercentages = [0.3145, 0.3795, 0.4625]
      return taxBracketPercentages[taxBracketNumber - 1]
    })
  }

  public getTaxpayerInformation: (
    nationalId: string,
  ) => Promise<TaxPayerInformation> = (nationalId) =>
    mockAsync({
      nationalId: MockUser.nationalId,
      name: MockUser.name,
      workingSituation: 'Launþegi',
      lastPersonalTaxCreditPercentageUsed: 1,
      monthlyIncome: 589459,
      ageOrDisabilityBenefitsFromSocialInsuranceAdministration: 25000,
      ageOrDisabilityBenefitsFromPensionFunds: 0,
      personalPensionFundPaymentPercentage: 0.04,
      unionPaymentPercentage: 0.01,
      percentageOfWork: 1,
      pensionFundPaymentPercentage: 0.04,
      isOnMaternityOrPaternityLeave: false,
      numberOfChildrenInCare: 1,
    })
}
