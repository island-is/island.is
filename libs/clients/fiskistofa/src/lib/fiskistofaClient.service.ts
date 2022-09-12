import { Injectable } from '@nestjs/common'
import {
  GetShipsInput,
  GetQuotaTypesForCalendarYear,
  GetQuotaTypesForTimePeriod,
  GetUpdatedShipStatusForTimePeriod,
  GetShipStatusForTimePeriod,
  GetShipStatusForCalendarYear,
  GetUpdatedShipStatusForCalendarYear,
} from '@island.is/api/domains/fiskistofa'
import {
  V1StadaskipsKvotategundirAlmanaksarArGetRequest,
  V1StadaskipsSkipnumerAlmanaksarArDeilistofnarBreyttPostRequest,
  V1StadaskipsSkipnumerAlmanaksarArDeilistofnarGetRequest,
  V1StadaskipsSkipnumerFiskveidiarTimabilBreyttPostRequest,
  V1StadaskipsSkipnumerFiskveidiarTimabilGetRequest,
} from '../../gen/fetch'
import { FetchError } from '@island.is/clients/middlewares'
import { FiskistofaApi } from './api'

@Injectable()
export class FiskistofaClientService {
  constructor(private api: FiskistofaApi) {}

  async wrapper(callback: (api: FiskistofaApi) => void) {
    try {
      this.api.initialize()
      callback(this.api)
    } catch (error) {
      if (error instanceof FetchError && error.status === 401) {
        this.api.initialize(true)
        callback(this.api)
      }
    }
  }

  async getUpdatedShipStatusForTimePeriod(
    input: GetUpdatedShipStatusForTimePeriod,
  ) {
    const params: V1StadaskipsSkipnumerFiskveidiarTimabilBreyttPostRequest = {
      skipnumer: input.shipNumber,
      timabil: input.timePeriod,
      aflamarkSkipsBreytingarDTO: {
        breytingarFisktegundar: input.changes.map(
          ({ catchChange, allowedCatchChange, id }) => ({
            aflabreyting: catchChange,
            aflamarksbreyting: allowedCatchChange,
            kvotategund: id,
          }),
        ),
      },
    }
    return this.wrapper((api) => api.getUpdatedShipStatusForTimePeriod(params))
  }

  async getShipStatusForTimePeriod(input: GetShipStatusForTimePeriod) {
    const params: V1StadaskipsSkipnumerFiskveidiarTimabilGetRequest = {
      skipnumer: input.shipNumber,
      timabil: input.timePeriod,
    }
    return this.wrapper((api) => api.getShipStatusForTimePeriod(params))
  }

  async getShipStatusForCalendarYear(input: GetShipStatusForCalendarYear) {
    const params: V1StadaskipsSkipnumerAlmanaksarArDeilistofnarGetRequest = {
      ar: input.year,
      skipnumer: input.shipNumber,
    }
    return this.wrapper((api) => api.getShipStatusForCalendarYear(params))
  }

  async getUpdatedShipStatusForCalendarYear(
    input: GetUpdatedShipStatusForCalendarYear,
  ) {
    const params: V1StadaskipsSkipnumerAlmanaksarArDeilistofnarBreyttPostRequest = {
      ar: input.year,
      skipnumer: input.shipNumber,
      aflamarkSkipsBreytingarDTO: {
        breytingarFisktegundar: input.changes.map(
          ({ catchChange, allowedCatchChange, id }) => ({
            aflabreyting: catchChange,
            aflamarksbreyting: allowedCatchChange,
            kvotategund: id,
          }),
        ),
      },
    }
    return this.wrapper((api) =>
      api.getUpdatedShipStatusForCalendarYear(params),
    )
  }

  async getQuotaTypesForTimePeriod(input: GetQuotaTypesForTimePeriod) {
    const params: V1StadaskipsSkipnumerFiskveidiarTimabilGetRequest = {
      skipnumer: input.shipNumber,
      timabil: input.timePeriod,
    }
    return this.wrapper((api) => api.getQuotaTypesForTimePeriod(params))
  }

  async getQuotaTypesForCalendarYear(input: GetQuotaTypesForCalendarYear) {
    const params: V1StadaskipsKvotategundirAlmanaksarArGetRequest = {
      ar: input.year,
    }
    return this.wrapper((api) => api.getQuotaTypesForCalendarYear(params))
  }

  async getShips(input: GetShipsInput) {
    const params = {
      heiti: input.shipName,
    }
    return this.wrapper((api) => api.getShips(params))
  }
}
