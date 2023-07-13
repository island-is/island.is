import { Injectable } from '@nestjs/common'
import {
  EinstaklingarApi,
  EinstaklingurDTOAllt,
  GerviEinstaklingarApi,
} from '../../gen/fetch'
import { AddressDto, formatAddressDto } from './types/address.dto'
import { IndividualDto, formatIndividualDto } from './types/individual.dto'
import { CustodianDto, formatCustodianDto } from './types/custodian.dto'
import { SpouseDto, formatSpouseDto } from './types/spouse.dto'
import { CitizenshipDto, formatCitizenshipDto } from './types/citizenship.dto'
import { BirthplaceDto, formatBirthplaceDto } from './types/birthplace.dto'
import { NameDto, formatNameDto } from './types/name.dto'
import { ReligionDto, formatReligionDto } from './types/religion.dto'
import { ParentDto, formatParentDto } from './types/parent.dto'
import { ExcludesFalse } from './utils'
import { ChildDto } from './types/child.dto'
import { FamilyDto } from './types/family.dto'

@Injectable()
export class NationalRegistryV3ClientService {
  constructor(private individualApi: EinstaklingarApi) {}

  async getAddress(nationalId: string): Promise<AddressDto | null> {
    return formatAddressDto(
      await this.individualApi.midlunV02EinstaklingarNationalIdHeimilisfangGet({
        nationalId,
      }),
    )
  }

  async getIndividual(nationalId: string): Promise<IndividualDto | null> {
    return formatIndividualDto(
      await this.individualApi.midlunV02EinstaklingarNationalIdGet({
        nationalId,
      }),
    )
  }

  async getFamily(nationalId: string): Promise<FamilyDto | null> {
    const familyMembers = await this.individualApi.midlunV02EinstaklingarNationalIdLogforeldrarGet(
      { nationalId },
    )

    if (!familyMembers) {
      return null
    }

    return {
      parents:
        familyMembers.logForeldrar
          ?.map((parent) => formatParentDto(parent))
          .filter((Boolean as unknown) as ExcludesFalse) ?? null,
      children:
        familyMembers.born
          ?.map((parent) => formatParentDto(parent))
          .filter((Boolean as unknown) as ExcludesFalse) ?? null,
    }
  }

  async getCustodians(nationalId: string): Promise<Array<CustodianDto> | null> {
    const child = await this.individualApi.midlunV02EinstaklingarNationalIdGet({
      nationalId,
    })

    if (!child) {
      return null
    }

    return (
      child?.forsja?.forsjaradilar
        ?.map((custodian) =>
          formatCustodianDto(custodian, child.logheimilistengsl),
        )
        .filter((Boolean as unknown) as ExcludesFalse) ?? null
    )
  }

  async getSpouse(nationalId: string): Promise<SpouseDto | null> {
    const data = await this.individualApi.midlunV02EinstaklingarNationalIdHjuGet(
      {
        nationalId,
      },
    )

    return formatSpouseDto(data)
  }

  async getCitizenship(nationalId: string): Promise<CitizenshipDto | null> {
    const data = await this.individualApi.midlunV02EinstaklingarNationalIdRikisfangGet(
      {
        nationalId,
      },
    )

    return formatCitizenshipDto(data)
  }
  async getBirthplace(nationalId: string): Promise<BirthplaceDto | null> {
    const data = await this.individualApi.midlunV02EinstaklingarNationalIdFaedingarstadurGet(
      {
        nationalId,
      },
    )

    return formatBirthplaceDto(data)
  }
  async getName(nationalId: string): Promise<NameDto | null> {
    const data = await this.individualApi.midlunV02EinstaklingarNationalIdNafnItarGet(
      {
        nationalId,
      },
    )

    return formatNameDto(data)
  }
  async getReligion(nationalId: string): Promise<ReligionDto | null> {
    const data = await this.individualApi.midlunV02EinstaklingarNationalIdTruGet(
      {
        nationalId,
      },
    )

    return formatReligionDto(data)
  }
}
