import {
    BasicDataProvider,
    Application,
    SuccessfulDataProviderResult,
    FailedDataProviderResult,
  } from '@island.is/application/core'
  import { DistrictCommissionersAgenciesResponse } from '../types/schema'
  
  export class DistrictsProvider extends BasicDataProvider {
    type = 'DistrictsProvider'
  
    async provide() {
      //TODO
      const query = `
        query getSyslumennDistrictCommissionersAgencies {
          getSyslumennDistrictCommissionersAgencies {
            name
            place
            address
            id
          }
        }
      `
  
      return this.useGraphqlGateway(query)
        .then(async (res: Response) => {
          const response = await res.json() 
          if (response.errors?.length > 0) {
            return this.handleError(response.errors[0])
          }
  
          return Promise.resolve(response.data.getSyslumennDistrictCommissionersAgencies)
        })
        .catch((error) => this.handleError(error))
  
    }
  
    handleError(error: any) {
      console.log('Provider error - DistrictsProvider:', error)
      return Promise.resolve({})
    }
  
    onProvideError(result: string): FailedDataProviderResult {
      return {
        date: new Date(),
        reason: result,
        status: 'failure',
        data: result,
      }
    }
  
    onProvideSuccess(result: object): SuccessfulDataProviderResult {
      console.log(result)
      return { date: new Date(), status: 'success', data: result }
    }
  }
  