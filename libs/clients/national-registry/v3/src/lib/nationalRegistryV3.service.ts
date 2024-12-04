import { Injectable } from '@nestjs/common'

import { handle204 } from '@island.is/clients/middlewares'
import { isDefined } from '@island.is/shared/utils'

import {
  EinstaklingarApi,
  EinstaklingurDTOAllt,
  EinstaklingurDTOFaeding,
  EinstaklingurDTOForsjaItem,
  EinstaklingurDTOHeimili,
  EinstaklingurDTOHju,
  EinstaklingurDTOItarAuka,
  EinstaklingurDTOLogforeldrar,
  EinstaklingurDTOLoghTengsl,
  EinstaklingurDTONafnItar,
  EinstaklingurDTORikisfang,
  EinstaklingurDTOTru,
  GerviEinstaklingarApi,
} from '../../gen/fetch'

@Injectable()
export class NationalRegistryV3ClientService {
  constructor(
    private individualApi: EinstaklingarApi,
    private fakeApi: GerviEinstaklingarApi,
  ) {}

  getAddress(nationalId: string): Promise<EinstaklingurDTOHeimili | null> {
    return handle204(
      this.individualApi.midlunV1EinstaklingarNationalIdHeimilisfangGetRaw({
        nationalId,
      }),
    )
  }

  getAllDataIndividual(
    nationalId: string,
    useFakeApi?: boolean,
  ): Promise<EinstaklingurDTOAllt | null> {
    return useFakeApi
      ? this.fakeApi.midlunV1GerviEinstaklingarNationalIdGet({
          nationalId,
        })
      : handle204(
          this.individualApi.midlunV1EinstaklingarNationalIdGetRaw({
            nationalId,
          }),
        )
  }

  getBiologicalFamily(
    nationalId: string,
  ): Promise<EinstaklingurDTOLogforeldrar | null> {
    return handle204(
      this.individualApi.midlunV1EinstaklingarNationalIdLogforeldrarGetRaw({
        nationalId,
      }),
    )
  }

  async getCustodians(
    nationalId: string,
  ): Promise<Array<EinstaklingurDTOForsjaItem> | null> {
    const child = await handle204(
      this.individualApi.midlunV1EinstaklingarNationalIdForsjaGetRaw({
        nationalId,
      }),
    )

    return child?.forsjaradilar?.filter(isDefined) ?? null
  }

  getSpouse(nationalId: string): Promise<EinstaklingurDTOHju | null> {
    return handle204(
      this.individualApi.midlunV1EinstaklingarNationalIdHjuGetRaw({
        nationalId,
      }),
    )
  }

  getCitizenship(
    nationalId: string,
  ): Promise<EinstaklingurDTORikisfang | null> {
    return handle204(
      this.individualApi.midlunV1EinstaklingarNationalIdRikisfangGetRaw({
        nationalId,
      }),
    )
  }

  getBirthplace(nationalId: string): Promise<EinstaklingurDTOFaeding | null> {
    return handle204(
      this.individualApi.midlunV1EinstaklingarNationalIdFaedingarstadurGetRaw({
        nationalId,
      }),
    )
  }

  getName(nationalId: string): Promise<EinstaklingurDTONafnItar | null> {
    return handle204(
      this.individualApi.midlunV1EinstaklingarNationalIdNafnItarGetRaw({
        nationalId,
      }),
    )
  }

  getReligion(nationalId: string): Promise<EinstaklingurDTOTru | null> {
    return handle204(
      this.individualApi.midlunV1EinstaklingarNationalIdTruGetRaw({
        nationalId,
      }),
    )
  }

  getHousing(nationalId: string): Promise<EinstaklingurDTOItarAuka | null> {
    return handle204(
      this.individualApi.midlunV1EinstaklingarNationalIdItarGetRaw({
        nationalId,
      }),
    )
  }

  getDomicileData(
    nationalId: string,
  ): Promise<EinstaklingurDTOLoghTengsl | null> {
    return handle204(
      this.individualApi.midlunV1EinstaklingarNationalIdLogheimilistengslGetRaw(
        {
          nationalId,
        },
      ),
    )
  }
}
