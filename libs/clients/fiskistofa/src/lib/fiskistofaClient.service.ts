import { Injectable } from '@nestjs/common'
import { FetchError } from '@island.is/clients/middlewares'
import {
  SkipApi,
  StadaSkipsApi,
  V1SkipSkipnumerGetRequest,
  V1StadaskipsKvotategundirAlmanaksarArGetRequest,
  V1StadaskipsKvotategundirFiskveidiarFiskveidiarGetRequest,
  V1StadaskipsSkipnumerAlmanaksarArDeilistofnarBreyttPostRequest,
  V1StadaskipsSkipnumerAlmanaksarArDeilistofnarGetRequest,
  V1StadaskipsSkipnumerFiskveidiarFiskveidiarBreyttPostRequest,
  V1StadaskipsSkipnumerFiskveidiarFiskveidiarGetRequest,
  V1StadaskipsSkipnumerFiskveidiarFiskveidiarKvotiBreyttPostRequest,
} from '../../gen/fetch'
import {
  mapQuotaType,
  mapShipStatusForCalendarYear,
  mapShipStatusForTimePeriod,
} from './utils'

@Injectable()
export class FiskistofaClientService {
  constructor(
    private readonly shipApi: SkipApi,
    private readonly shipStatusApi: StadaSkipsApi,
  ) {}

  async updateShipStatusForTimePeriod(input: {
    shipNumber: number
    timePeriod: string
    changes: { catchChange: number; catchQuotaChange: number; id: number }[]
  }) {
    const params: V1StadaskipsSkipnumerFiskveidiarFiskveidiarBreyttPostRequest =
      {
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
    const data =
      await this.shipStatusApi.v1StadaskipsSkipnumerFiskveidiarFiskveidiarBreyttPost(
        params,
      )
    return { fiskistofaShipStatus: mapShipStatusForTimePeriod(data) }
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
    const params: V1StadaskipsSkipnumerFiskveidiarFiskveidiarKvotiBreyttPostRequest =
      {
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
    const data =
      await this.shipStatusApi.v1StadaskipsSkipnumerFiskveidiarFiskveidiarKvotiBreyttPost(
        params,
      )
    return {
      fiskistofaShipQuotaStatus: {
        nextYearCatchQuota: data?.aNaestaArAflamark,
        nextYearQuota: data?.aNaestaArKvotiBreytt,
        nextYearFromQuota: data?.afNaestaAriKvotiBreytt,
        totalCatchQuota: data?.heildarAflamark,
        quotaShare: data?.hlutdeildBreytt,
        id: data?.kvotategund,
        newStatus: data?.nyStada,
        unused: data?.onotad,
        percentCatchQuotaFrom: data?.prosentaAflamarkFra,
        percentCatchQuotaTo: data?.prosentaAflamarkTil,
        excessCatch: data?.umframafli,
        allocatedCatchQuota: data?.uthlutadAflamarkBreytt,
      },
    }
  }

  async getShipStatusForTimePeriod(input: {
    shipNumber: number
    timePeriod: string
  }) {
    const params: V1StadaskipsSkipnumerFiskveidiarFiskveidiarGetRequest = {
      skipnumer: input.shipNumber,
      fiskveidiar: input.timePeriod,
    }
    const data =
      await this.shipStatusApi.v1StadaskipsSkipnumerFiskveidiarFiskveidiarGet(
        params,
      )
    return {
      fiskistofaShipStatus: mapShipStatusForTimePeriod(data),
    }
  }

  async getShipStatusForCalendarYear(input: {
    shipNumber: number
    year: string
  }) {
    const params: V1StadaskipsSkipnumerAlmanaksarArDeilistofnarGetRequest = {
      ar: input.year,
      skipnumer: input.shipNumber,
    }
    const data =
      await this.shipStatusApi.v1StadaskipsSkipnumerAlmanaksarArDeilistofnarGet(
        params,
      )
    return {
      fiskistofaShipStatus: mapShipStatusForCalendarYear(data),
    }
  }

  async updateShipStatusForCalendarYear(input: {
    shipNumber: number
    year: string
    changes: { id: number; catchChange: number; catchQuotaChange: number }[]
  }) {
    const params: V1StadaskipsSkipnumerAlmanaksarArDeilistofnarBreyttPostRequest =
      {
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
    const data =
      await this.shipStatusApi.v1StadaskipsSkipnumerAlmanaksarArDeilistofnarBreyttPost(
        params,
      )
    return {
      fiskistofaShipStatus: mapShipStatusForCalendarYear(data),
    }
  }

  async getQuotaTypesForTimePeriod(input: { timePeriod: string }) {
    const params: V1StadaskipsKvotategundirFiskveidiarFiskveidiarGetRequest = {
      fiskveidiar: input.timePeriod,
    }
    const data =
      await this.shipStatusApi.v1StadaskipsKvotategundirFiskveidiarFiskveidiarGet(
        params,
      )
    return {
      fiskistofaQuotaTypes: (data ?? []).map(mapQuotaType),
    }
  }

  async getQuotaTypesForCalendarYear(input: { year: string }) {
    const params: V1StadaskipsKvotategundirAlmanaksarArGetRequest = {
      ar: input.year,
    }
    const data =
      await this.shipStatusApi.v1StadaskipsKvotategundirAlmanaksarArGet(params)
    return {
      fiskistofaQuotaTypes: (data ?? []).map(mapQuotaType),
    }
  }

  async getShips(input: { shipName: string }) {
    const params = {
      heiti: input.shipName,
    }
    const data = await this.shipApi.v1SkipHeitiHeitiGet(params)
    return {
      fiskistofaShips: (data ?? []).map((ship) => ({
        id: ship?.skipaskraNumer,
        name: ship?.heiti ?? '',
        typeOfVessel: ship?.utgerdarflokkur ?? '',
        operator: ship?.utgerd ?? '',
        homePort: ship?.heimahofn ?? '',
      })),
    }
  }

  async getSingleShip(input: { shipNumber: number }) {
    const params: V1SkipSkipnumerGetRequest = {
      skipnumer: input.shipNumber,
    }
    try {
      const data = await this.shipApi.v1SkipSkipnumerGet(params)
      return {
        fiskistofaSingleShip: {
          shipNumber: data?.skipNumer,
          name: data?.heiti ?? '',
          ownerName: data?.eigandiHeiti ?? '',
          ownerSsn: data?.eigandiKennitala ?? '',
          operatorName: data?.rekstraradiliHeiti ?? '',
          operatorSsn: data?.rekstraradiliKennitala ?? '',
          operatingCategory: data?.utgerdarflokkurHeiti ?? '',
          grossTons: data?.bruttotonn,
        },
      }
    } catch (error) {
      if (error instanceof FetchError) {
        return {
          fiskistofaSingleShip: null,
        }
      }
      throw error
    }
  }
}
