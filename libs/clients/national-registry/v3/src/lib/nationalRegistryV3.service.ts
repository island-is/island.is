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
    console.log("v3.getAddress")
    const res = this.individualApi.midlunV02EinstaklingarNationalIdHeimilisfangGet({
      nationalId,
    })
    console.log(res)
    return res
  }

  getAllDataIndividual(
    nationalId: string,
  ): Promise<EinstaklingurDTOAllt | null> {
    console.log("v3.getAllDataIndividual")
    const res =  this.individualApi.midlunV02EinstaklingarNationalIdGet({
      nationalId,
    })
    console.log(res)
    return res
  }

  getFamily(nationalId: string): Promise<EinstaklingurDTOLogforeldrar | null> {
    console.log("v3.getAllDataIndividual")
    const res =  this.individualApi.midlunV02EinstaklingarNationalIdLogforeldrarGet({
      nationalId,
    })
    console.log(res)
    return res
  }

  async getCustodians(
    nationalId: string,
  ): Promise<Array<EinstaklingurDTOForsjaItem> | null> {
    console.log("v3.getAllDataIndividual")
    const child =
      await this.individualApi.midlunV02EinstaklingarNationalIdForsjaGet({
        nationalId,
      })

      console.log(child)

    return child?.forsjaradilar?.filter(isDefined) ?? null
  }

  getSpouse(nationalId: string): Promise<EinstaklingurDTOHju | null> {
    console.log("v3.getAllDataIndividual")
    const res =  this.individualApi.midlunV02EinstaklingarNationalIdHjuGet({
      nationalId,
    })
    console.log(res)
    return res
  }

  getCitizenship(
    nationalId: string,
  ): Promise<EinstaklingurDTORikisfang | null> {
    console.log("v3.getAllDataIndividual")
    const res =  this.individualApi.midlunV02EinstaklingarNationalIdRikisfangGet({
      nationalId,
    })
    console.log(res)
    return res
  }

  getBirthplace(nationalId: string): Promise<EinstaklingurDTOFaeding | null> {
    console.log("v3.getAllDataIndividual")
    const res =  this.individualApi.midlunV02EinstaklingarNationalIdFaedingarstadurGet(
      {
        nationalId,
      },
    )
    console.log(res)
    return res
  }

  getName(nationalId: string): Promise<EinstaklingurDTONafnAllt | null> {
    console.log("v3.getAllDataIndividual")
    const res =  this.individualApi.midlunV02EinstaklingarNationalIdNafnItarGet({
      nationalId,
    })
    console.log(res)
    return res
  }

  getReligion(nationalId: string): Promise<EinstaklingurDTOTru | null> {
    console.log("v3.getAllDataIndividual")
    const res =  this.individualApi.midlunV02EinstaklingarNationalIdTruGet({
      nationalId,
    })
    console.log(res)
    return res
  }

  getHousing(nationalId: string): Promise<EinstaklingurDTOItarAuka | null> {
    console.log("v3.getAllDataIndividual")
    const res =  this.individualApi.midlunV02EinstaklingarNationalIdItarGet({
      nationalId,
    })
    console.log(res)
    return res
  }

  getDomicileData(
    nationalId: string,
  ): Promise<EinstaklingurDTOLoghTengsl | null> {
    console.log("v3.getAllDataIndividual")
    const res =  this.individualApi.midlunV02EinstaklingarNationalIdLogheimilistengslGet(
      {
        nationalId,
      },
    )
    console.log(res)
    return res
  }
}
