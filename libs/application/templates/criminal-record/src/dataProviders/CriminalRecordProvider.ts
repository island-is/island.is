import {
    BasicDataProvider,
    SuccessfulDataProviderResult,
    FailedDataProviderResult,
    coreErrorMessages,
  } from '@island.is/application/core'
  //import { PaymentCatalogItem } from '@island.is/api/schema'
  
  export class CriminalRecordProvider extends BasicDataProvider {
    type = 'FeeInfoProvider'
  
    async provide(): Promise<boolean> {
      console.log('CriminalRecordProvider-------------')
      return false;
      //return (await this.checkIfExistsCriminalRecord('1234567890')) || false
    }
  
    onProvideError(): FailedDataProviderResult {
      return {
        date: new Date(),
        reason: coreErrorMessages.errorDataProvider,
        status: 'failure',
        data: {},
      }
    }
  
    onProvideSuccess(
      result: Record<string, unknown>,
    ): SuccessfulDataProviderResult {
      return { date: new Date(), status: 'success', data: result }
    }
  }
  