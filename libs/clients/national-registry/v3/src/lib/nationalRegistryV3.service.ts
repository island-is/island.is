import { Injectable } from '@nestjs/common'
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
  EinstaklingurDTONafnAllt,
  EinstaklingurDTORikisfang,
  EinstaklingurDTOTru,
  GerviEinstaklingarApi,
} from '../../gen/fetch'
import { isDefined } from '@island.is/shared/utils'

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
      : this.individualApi.midlunV1EinstaklingarNationalIdGet({ nationalId })
  }

  getFamily(nationalId: string): Promise<EinstaklingurDTOLogforeldrar | null> {
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
}
