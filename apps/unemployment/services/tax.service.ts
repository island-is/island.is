import { TaxInfo } from '../entities/tax-info'

export class TaxService {
  static getTaxInformation(nationalId: string): TaxInfo {
    return {
      name: 'Guðrún Jónsdóttir',
      nationalId: '170694-1119',
      address: 'Lindargata 3',
      city: 'Reykjavík',
      postalCode: '101',
      email: 'gj@island.is',
      phone: '4265500',
      status: 'Launþegi',
      applicationDate: new Date(),
      taxDiscount: 50792,
      taxCardRatio: 100,
      monthlyIncome: 589459,
      pensionFundsIncome: 0,
      insuranceIncome: 25000,
      taxStep1: 0.3145,
      taxStep2: 0.3795,
      additionalPensionFundsRatio: 4,
      workersUnionRatio: 1,
      jobRatio: 100,
      pensionFundsRatio: 4,
      parentalLeave: false,
      unEmploymentBase: 307430,
      numberOfChildren: 1,
    } as TaxInfo
  }
}
