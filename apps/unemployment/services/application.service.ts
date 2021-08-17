import { ApplicationResult } from '../entities/application-result'

export class ApplicationService {
  // TODO: Remove static and make injectable
  public static getTemporaryResultsBeforeSubmit(nationalId = '1706941119'): ApplicationResult {
    // TODO: Calculate the results
    return {
      name: 'Guðrún Jónsdóttir',
      nationalId: nationalId,
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
    } as ApplicationResult
  }

  public static saveApplication(application: any) {
    // TODO: Receive application object and write to localstorage
    const dummyApplication = {
      name: 'Guðrún Jónsdóttir'
    }

    localStorage.setItem('application', JSON.stringify(dummyApplication))
  }

  public static getApplication() {
    // TODO: Remove local storage
    const application = localStorage.getItem('application')
    console.log(application)
    if (!application) {
      return null
    }
    console.log(JSON.parse(application))
    return JSON.parse(application)
  }

  public submit() {
    return true
  }
}
