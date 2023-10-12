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
} from '../../gen/fetch'
import { isDefined } from '@island.is/shared/utils'

@Injectable()
export class NationalRegistryV3ClientService {
  constructor(private individualApi: EinstaklingarApi) {}

  getAddress(nationalId: string): Promise<EinstaklingurDTOHeimili | null> {
    return this.individualApi.midlunV02EinstaklingarNationalIdHeimilisfangGet({
      nationalId,
    })
  }

  getAllDataIndividual(
    nationalId: string,
  ): Promise<EinstaklingurDTOAllt | null> {
    return this.individualApi.midlunV02EinstaklingarNationalIdGet({
      nationalId,
    })
  }

  getFamily(nationalId: string): Promise<EinstaklingurDTOLogforeldrar | null> {
    return this.individualApi.midlunV02EinstaklingarNationalIdLogforeldrarGet({
      nationalId,
    })
  }

  async getCustodians(
    nationalId: string,
  ): Promise<Array<EinstaklingurDTOForsjaItem> | null> {
    const child =
      await this.individualApi.midlunV02EinstaklingarNationalIdForsjaGet({
        nationalId,
      })

    return child?.forsjaradilar?.filter(isDefined) ?? null
  }

  getSpouse(nationalId: string): Promise<EinstaklingurDTOHju | null> {
    return this.individualApi.midlunV02EinstaklingarNationalIdHjuGet({
      nationalId,
    })
  }

  getCitizenship(
    nationalId: string,
  ): Promise<EinstaklingurDTORikisfang | null> {
    return this.individualApi.midlunV02EinstaklingarNationalIdRikisfangGet({
      nationalId,
    })
  }

  getBirthplace(nationalId: string): Promise<EinstaklingurDTOFaeding | null> {
    return this.individualApi.midlunV02EinstaklingarNationalIdFaedingarstadurGet(
      {
        nationalId,
      },
    )
  }

  getName(nationalId: string): Promise<EinstaklingurDTONafnAllt | null> {
    return this.individualApi.midlunV02EinstaklingarNationalIdNafnItarGet({
      nationalId,
    })
  }

  getReligion(nationalId: string): Promise<EinstaklingurDTOTru | null> {
    return this.individualApi.midlunV02EinstaklingarNationalIdTruGet({
      nationalId,
    })
  }

  getHousing(nationalId: string): Promise<EinstaklingurDTOItarAuka | null> {
    return this.individualApi.midlunV02EinstaklingarNationalIdItarGet({
      nationalId,
    })
  }

  getDomicileData(
    nationalId: string,
  ): Promise<EinstaklingurDTOLoghTengsl | null> {
    return this.individualApi.midlunV02EinstaklingarNationalIdLogheimilistengslGet(
      {
        nationalId,
      },
    )
  }
}
