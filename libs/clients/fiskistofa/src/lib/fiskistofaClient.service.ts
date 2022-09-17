import { Injectable } from '@nestjs/common'
import {
  GetShipsInput,
  GetQuotaTypesForCalendarYearInput,
  GetQuotaTypesForTimePeriodInput,
  UpdateShipStatusForCalendarYearInput,
  GetShipStatusForCalendarYearInput,
  GetShipStatusForTimePeriodInput,
  UpdateShipStatusForTimePeriodInput,
  UpdateShipQuotaStatusForTimePeriodInput,
} from '@island.is/api/domains/fiskistofa'
import {
  V1StadaskipsKvotategundirAlmanaksarArGetRequest,
  V1StadaskipsKvotategundirFiskveidiarFiskveidiarGetRequest,
  V1StadaskipsSkipnumerAlmanaksarArDeilistofnarBreyttPostRequest,
  V1StadaskipsSkipnumerAlmanaksarArDeilistofnarGetRequest,
  V1StadaskipsSkipnumerFiskveidiarFiskveidiarBreyttPostRequest,
  V1StadaskipsSkipnumerFiskveidiarFiskveidiarGetRequest,
  V1StadaskipsSkipnumerFiskveidiarFiskveidiarKvotiBreyttPostRequest,
} from '../../gen/fetch'
import { FetchError } from '@island.is/clients/middlewares'
import { FiskistofaApi } from './api'

@Injectable()
export class FiskistofaClientService {
  constructor(private api: FiskistofaApi) {}

  async wrapper(callback: (api: FiskistofaApi) => any) {
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

  async updateShipStatusForTimePeriod(
    input: UpdateShipStatusForTimePeriodInput,
  ) {
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

  async updateShipQuotaStatusForTimePeriod(
    input: UpdateShipQuotaStatusForTimePeriodInput,
  ) {
    const params: V1StadaskipsSkipnumerFiskveidiarFiskveidiarKvotiBreyttPostRequest = {
      aflamarkSkipsKvotaParams: {
        kvotategund: 1,
        afNaestaAriKvotiBreytt: 1,
        aNaestaArKvotiBreytt: 1,
        hlutdeildBreytt: 1,
        uthlutadAflamarkBreytt: 1,
      },
      fiskveidiar: '',
      skipnumer: 1281,
    }
    return this.wrapper((api) => api.updateShipQuotaStatusForTimePeriod(params))
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

  async updateShipStatusForCalendarYear(
    input: UpdateShipStatusForCalendarYearInput,
  ) {
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
