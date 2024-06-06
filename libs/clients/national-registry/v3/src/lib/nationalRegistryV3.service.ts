import { Injectable } from '@nestjs/common'

import { isDefined } from '@island.is/shared/utils'

import {
  ApiResponse,
  EinstaklingarApi,
  EinstaklingurDTOAllt,
  EinstaklingurDTOFaeding,
  EinstaklingurDTOForsjaItem,
  EinstaklingurDTOHeimili,
  EinstaklingurDTOHju,
  EinstaklingurDTOItarAuka,
  EinstaklingurDTOLogforeldrar,
  EinstaklingurDTOLoghTengsl,
  EinstaklingurDTONafnAllt,
  EinstaklingurDTORikisfang,
  EinstaklingurDTOTru,
  GerviEinstaklingarApi,
} from '../../gen/fetch'

const MODERN_IGNORED_STATUS = 204

@Injectable()
export class NationalRegistryV3ClientService {
  constructor(
    private individualApi: EinstaklingarApi,
    private fakeApi: GerviEinstaklingarApi,
  ) {}

  getAddress(nationalId: string): Promise<EinstaklingurDTOHeimili | null> {
    return this.individualApi.midlunV1EinstaklingarNationalIdHeimilisfangGet({
      nationalId,
    })
  }

  getAllDataIndividual(
    nationalId: string,
    useFakeApi?: boolean,
  ): Promise<EinstaklingurDTOAllt | null> {
    return useFakeApi
      ? this.fakeApi.midlunV1GerviEinstaklingarNationalIdGet({
          nationalId,
        })
      : this.handleModernMissingData(
          this.individualApi.midlunV1EinstaklingarNationalIdGetRaw({
            nationalId,
          }),
        )
  }

  getBiologicalFamily(
    nationalId: string,
  ): Promise<EinstaklingurDTOLogforeldrar | null> {
    return this.individualApi.midlunV1EinstaklingarNationalIdLogforeldrarGet({
      nationalId,
    })
  }

  async getCustodians(
    nationalId: string,
  ): Promise<Array<EinstaklingurDTOForsjaItem> | null> {
    const child =
      await this.individualApi.midlunV1EinstaklingarNationalIdForsjaGet({
        nationalId,
      })

    return child?.forsjaradilar?.filter(isDefined) ?? null
  }

  getSpouse(nationalId: string): Promise<EinstaklingurDTOHju | null> {
    return this.individualApi.midlunV1EinstaklingarNationalIdHjuGet({
      nationalId,
    })
  }

  getCitizenship(
    nationalId: string,
  ): Promise<EinstaklingurDTORikisfang | null> {
    return this.individualApi.midlunV1EinstaklingarNationalIdRikisfangGet({
      nationalId,
    })
  }

  getBirthplace(nationalId: string): Promise<EinstaklingurDTOFaeding | null> {
    return this.individualApi.midlunV1EinstaklingarNationalIdFaedingarstadurGet(
      {
        nationalId,
      },
    )
  }

  getName(nationalId: string): Promise<EinstaklingurDTONafnAllt | null> {
    return this.individualApi.midlunV1EinstaklingarNationalIdNafnItarGet({
      nationalId,
    })
  }

  getReligion(nationalId: string): Promise<EinstaklingurDTOTru | null> {
    return this.individualApi.midlunV1EinstaklingarNationalIdTruGet({
      nationalId,
    })
  }

  getHousing(nationalId: string): Promise<EinstaklingurDTOItarAuka | null> {
    return this.individualApi.midlunV1EinstaklingarNationalIdItarGet({
      nationalId,
    })
  }

  getDomicileData(
    nationalId: string,
  ): Promise<EinstaklingurDTOLoghTengsl | null> {
    return this.individualApi.midlunV1EinstaklingarNationalIdLogheimilistengslGet(
      {
        nationalId,
      },
    )
  }

  private async handleModernMissingData<T>(
    promise: Promise<ApiResponse<T>>,
  ): Promise<T | null> {
    const response = await promise
    if (response.raw.status === MODERN_IGNORED_STATUS) {
      return null
    }
    return response.value()
  }
}
