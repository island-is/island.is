import { Injectable } from '@nestjs/common'
import {
  GetShipsInput,
  GetQuotaTypesForCalendarYearInput,
  GetQuotaTypesForTimePeriodInput,
  GetUpdatedShipStatusForCalendarYearInput,
  GetShipStatusForCalendarYearInput,
  GetShipStatusForTimePeriodInput,
  GetUpdatedShipStatusForTimePeriodInput,
} from '@island.is/api/domains/fiskistofa'
import {
  V1StadaskipsKvotategundirAlmanaksarArGetRequest,
  V1StadaskipsKvotategundirFiskveidiarFiskveidiarGetRequest,
  V1StadaskipsSkipnumerAlmanaksarArDeilistofnarBreyttPostRequest,
  V1StadaskipsSkipnumerAlmanaksarArDeilistofnarGetRequest,
  V1StadaskipsSkipnumerFiskveidiarFiskveidiarBreyttPostRequest,
  V1StadaskipsSkipnumerFiskveidiarFiskveidiarGetRequest,
} from '../../gen/fetch'
import { FetchError } from '@island.is/clients/middlewares'
import { FiskistofaApi } from './api'

@Injectable()
export class FiskistofaClientService {
  constructor(private api: FiskistofaApi) {}

  async wrapper(callback: (api: FiskistofaApi) => void) {
    try {
      this.api.initialize()
      return callback(this.api)
    } catch (error) {
      if (error instanceof FetchError && error.status === 401) {
        this.api.initialize(true)
        return callback(this.api)
      }
    }
  }

  async getUpdatedShipStatusForTimePeriod(
    input: GetUpdatedShipStatusForTimePeriodInput,
  ) {
    const params: V1StadaskipsSkipnumerFiskveidiarFiskveidiarBreyttPostRequest = {
      skipnumer: input.shipNumber,
      fiskveidiar: input.timePeriod,
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

  async getShipStatusForTimePeriod(input: GetShipStatusForTimePeriodInput) {
    const params: V1StadaskipsSkipnumerFiskveidiarFiskveidiarGetRequest = {
      skipnumer: input.shipNumber,
      fiskveidiar: input.timePeriod,
    }
    return this.wrapper((api) => api.getShipStatusForTimePeriod(params))
  }

  async getShipStatusForCalendarYear(input: GetShipStatusForCalendarYearInput) {
    const params: V1StadaskipsSkipnumerAlmanaksarArDeilistofnarGetRequest = {
      ar: input.year,
      skipnumer: input.shipNumber,
    }
    return this.wrapper((api) => api.getShipStatusForCalendarYear(params))
  }

  async getUpdatedShipStatusForCalendarYear(
    input: GetUpdatedShipStatusForCalendarYearInput,
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

  async getQuotaTypesForTimePeriod(input: GetQuotaTypesForTimePeriodInput) {
    const params: V1StadaskipsKvotategundirFiskveidiarFiskveidiarGetRequest = {
      fiskveidiar: input.timePeriod,
    }
    return this.wrapper((api) => api.getQuotaTypesForTimePeriod(params))
  }

  async getQuotaTypesForCalendarYear(input: GetQuotaTypesForCalendarYearInput) {
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
