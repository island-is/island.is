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
import { ExcludesFalse } from './utils'

@Injectable()
export class NationalRegistryV3ClientService {
  constructor(
    private individualApi: EinstaklingarApi,
    private fakeApi: GerviEinstaklingarApi,
  ) {}

  getAddress = (nationalId: string): Promise<EinstaklingurDTOHeimili | null> =>
    this.individualApi.midlunV02EinstaklingarNationalIdHeimilisfangGet({
      nationalId,
    })

  async getAllDataIndividual(
    nationalId: string,
  ): Promise<EinstaklingurDTOAllt | null> {
    const data = await this.individualApi.midlunV02EinstaklingarNationalIdGet({
      nationalId,
    })
    return data ?? null
  }

  getFamily = (
    nationalId: string,
  ): Promise<EinstaklingurDTOLogforeldrar | null> =>
    this.individualApi.midlunV02EinstaklingarNationalIdLogforeldrarGet({
      nationalId,
    })

  async getCustodians(
    nationalId: string,
  ): Promise<Array<EinstaklingurDTOForsjaItem> | null> {
    const child =
      await this.individualApi.midlunV02EinstaklingarNationalIdForsjaGet({
        nationalId,
      })

    return (
      child?.forsjaradilar?.filter(Boolean as unknown as ExcludesFalse) ?? null
    )
  }

  getSpouse = (nationalId: string): Promise<EinstaklingurDTOHju | null> =>
    this.individualApi.midlunV02EinstaklingarNationalIdHjuGet({
      nationalId,
    })

  getCitizenship = (
    nationalId: string,
  ): Promise<EinstaklingurDTORikisfang | null> =>
    this.individualApi.midlunV02EinstaklingarNationalIdRikisfangGet({
      nationalId,
    })

  getBirthplace = (
    nationalId: string,
  ): Promise<EinstaklingurDTOFaeding | null> =>
    this.individualApi.midlunV02EinstaklingarNationalIdFaedingarstadurGet({
      nationalId,
    })

  getName = (nationalId: string): Promise<EinstaklingurDTONafnAllt | null> =>
    this.individualApi.midlunV02EinstaklingarNationalIdNafnItarGet({
      nationalId,
    })

  getReligion = (nationalId: string): Promise<EinstaklingurDTOTru | null> =>
    this.individualApi.midlunV02EinstaklingarNationalIdTruGet({
      nationalId,
    })

  getHousing = (nationalId: string): Promise<EinstaklingurDTOItarAuka | null> =>
    this.individualApi.midlunV02EinstaklingarNationalIdItarGet({
      nationalId,
    })

  getDomicileData = (
    nationalId: string,
  ): Promise<EinstaklingurDTOLoghTengsl | null> =>
    this.individualApi.midlunV02EinstaklingarNationalIdLogheimilistengslGet({
      nationalId,
    })
}
