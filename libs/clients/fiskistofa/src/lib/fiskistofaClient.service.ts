import { Injectable } from '@nestjs/common'
import { FetchError } from '@island.is/clients/middlewares'
import {
  V1SkipSkipnumerGetRequest,
  V1StadaskipsKvotategundirAlmanaksarArGetRequest,
  V1StadaskipsKvotategundirFiskveidiarFiskveidiarGetRequest,
  V1StadaskipsSkipnumerAlmanaksarArDeilistofnarBreyttPostRequest,
  V1StadaskipsSkipnumerAlmanaksarArDeilistofnarGetRequest,
  V1StadaskipsSkipnumerFiskveidiarFiskveidiarBreyttPostRequest,
  V1StadaskipsSkipnumerFiskveidiarFiskveidiarGetRequest,
  V1StadaskipsSkipnumerFiskveidiarFiskveidiarKvotiBreyttPostRequest,
} from '../../gen/fetch'
import { FiskistofaApi } from './api'

@Injectable()
export class FiskistofaClientService {
  constructor(private api: FiskistofaApi) {}

  async wrapper(callback: (api: FiskistofaApi) => any) {
    try {
      await this.api.initialize()
      return callback(this.api)
    } catch (error) {
      // If we are unauthorized, then we want to re-initialize the api by getting a new access token and then calling the callback again
      if (error instanceof FetchError) {
        if (error.status === 401) {
          await this.api.initialize(true)
          return callback(this.api)
        }
      }
      throw error
    }
  }

  async updateShipStatusForTimePeriod(input: {
    shipNumber: number
    timePeriod: string
    changes: { catchChange: number; catchQuotaChange: number; id: number }[]
  }) {
    const params: V1StadaskipsSkipnumerFiskveidiarFiskveidiarBreyttPostRequest = {
      skipnumer: input.shipNumber,
      fiskveidiar: input.timePeriod,
      aflamarkSkipsBreytingar: {
        breytingarFisktegundar: input.changes.map(
          ({ catchChange, catchQuotaChange, id }) => ({
            aflabreyting: catchChange,
            aflamarksbreyting: catchQuotaChange,
            kvotategund: id,
          }),
        ),
      },
    }
    return this.wrapper((api) => api.updateShipStatusForTimePeriod(params))
  }

  async updateShipQuotaStatusForTimePeriod(input: {
    shipNumber: number
    timePeriod: string
    change: {
      id: number
      nextYearFromQuota?: number
      nextYearQuota?: number
      quotaShare?: number
      allocatedCatchQuota?: number
    }
  }) {
    const params: V1StadaskipsSkipnumerFiskveidiarFiskveidiarKvotiBreyttPostRequest = {
      aflamarkSkipsKvotaParams: {
        kvotategund: input.change.id,
        afNaestaAriKvotiBreytt: input.change.nextYearFromQuota,
        aNaestaArKvotiBreytt: input.change.nextYearQuota,
        hlutdeildBreytt: input.change.quotaShare,
        uthlutadAflamarkBreytt: input.change.allocatedCatchQuota,
      },
      fiskveidiar: input.timePeriod,
      skipnumer: input.shipNumber,
    }
    return this.wrapper((api) => api.updateShipQuotaStatusForTimePeriod(params))
  }

  async getShipStatusForTimePeriod(input: {
    shipNumber: number
    timePeriod: string
  }) {
    const params: V1StadaskipsSkipnumerFiskveidiarFiskveidiarGetRequest = {
      skipnumer: input.shipNumber,
      fiskveidiar: input.timePeriod,
    }
    return this.wrapper((api) => api.getShipStatusForTimePeriod(params))
  }

  async getShipStatusForCalendarYear(input: {
    shipNumber: number
    year: string
  }) {
    const params: V1StadaskipsSkipnumerAlmanaksarArDeilistofnarGetRequest = {
      ar: input.year,
      skipnumer: input.shipNumber,
    }
    return this.wrapper((api) => api.getShipStatusForCalendarYear(params))
  }

  async updateShipStatusForCalendarYear(input: {
    shipNumber: number
    year: string
    changes: { id: number; catchChange: number; catchQuotaChange: number }[]
  }) {
    const params: V1StadaskipsSkipnumerAlmanaksarArDeilistofnarBreyttPostRequest = {
      ar: input.year,
      skipnumer: input.shipNumber,
      aflamarkSkipsBreytingar: {
        breytingarFisktegundar: input.changes.map(
          ({ catchChange, catchQuotaChange, id }) => ({
            aflabreyting: catchChange,
            aflamarksbreyting: catchQuotaChange,
            kvotategund: id,
          }),
        ),
      },
    }
    return this.wrapper((api) => api.updateShipStatusForCalendarYear(params))
  }

  async getQuotaTypesForTimePeriod(input: { timePeriod: string }) {
    const params: V1StadaskipsKvotategundirFiskveidiarFiskveidiarGetRequest = {
      fiskveidiar: input.timePeriod,
    }
    return this.wrapper((api) => api.getQuotaTypesForTimePeriod(params))
  }

  async getQuotaTypesForCalendarYear(input: { year: string }) {
    const params: V1StadaskipsKvotategundirAlmanaksarArGetRequest = {
      ar: input.year,
    }
    return this.wrapper((api) => api.getQuotaTypesForCalendarYear(params))
  }

  async getShips(input: { shipName: string }) {
    const params = {
      heiti: input.shipName,
    }
    return this.wrapper((api) => api.getShips(params))
  }

  async getSingleShip(input: { shipNumber: number }) {
    const params: V1SkipSkipnumerGetRequest = {
      skipnumer: input.shipNumber,
    }
    return this.wrapper((api) => api.getSingleShip(params))
  }
}
