import { Injectable } from '@nestjs/common'
import { SoffiaService } from './v1/soffia.service'
import { BrokerService } from './v3/broker.service'
import { SharedPerson } from './shared/types'
import { Birthplace, Citizenship, Spouse, Housing } from './shared/models'
import { mapMaritalStatus } from './shared/mapper'

@Injectable()
export class NationalRegistryService {
  constructor(private v1: SoffiaService, private v3: BrokerService) {}
  async getUser(nationalId: string, api: 'v1' | 'v3') {
    if (api === 'v3') {
      return null
    }
    return await this.v1.getUser(nationalId)
  }

  async getPerson(nationalId: string, api: 'v1' | 'v3') {
    return api === 'v3'
      ? await this.v3.getPerson(nationalId)
      : await this.v1.getPerson(nationalId)
  }

  async getFamily(nationalId: string, data?: SharedPerson) {
    if (data?.api === 'v3') {
      return null
    }
    return await this.v1.getFamily(nationalId)
  }

  async getFamilyMember(
    nationalId: string,
    familyMemberNationalId: string,
    data?: SharedPerson,
  ) {
    if (data?.api === 'v3') {
      return null
    }
    return await this.v1.getFamilyMemberDetails(
      nationalId,
      familyMemberNationalId,
    )
  }

  async getChildren(nationalId: string, data?: SharedPerson) {
    if (data?.api === 'v3') {
      return null
    }
    return await this.v1.getChildren(nationalId)
  }

  async getChildCustody(nationalId: string, data?: SharedPerson) {
    if (data?.api === 'v1') {
      return null
    }
    return await this.v3.getChildrenCustodyInformation(
      nationalId,
      data?.rawData,
    )
  }

  async getCustodians(nationalId: string, data?: SharedPerson) {
    if (data?.api === 'v1') {
      return null
    }
    return await this.v3.getCustodians(nationalId, data?.rawData)
  }

  async getParents(nationalId: string, data?: SharedPerson) {
    if (data?.api === 'v1') {
      return null
    }
    return await this.v3.getParents(nationalId, data?.rawData)
  }

  async getBirthplace(
    nationalId: string,
    data?: SharedPerson,
  ): Promise<Birthplace | null> {
    if (data?.api === 'v1') {
      return data.rawData
        ? {
            location: data.rawData?.Faedingarstadur ?? null,
            municipalityText: data.rawData?.Faedingarstadur,
            dateOfBirth: data.rawData?.Faedingardagur
              ? new Date(data.rawData.Faedingardagur)
              : null,
          }
        : null
    }
    return await this.v3.getBirthplace(nationalId, data?.rawData)
  }

  async getCitizenship(
    nationalId: string,
    data?: SharedPerson,
  ): Promise<Citizenship | null> {
    if (data?.api === 'v1') {
      return data.rawData
        ? {
            code: data.rawData.Rikisfang ?? null,
            name: data.rawData.RikisfangLand ?? null,
          }
        : null
    }
    return await this.v3.getCitizenship(nationalId, data?.rawData)
  }

  async getHousing(
    nationalId: string,
    data?: SharedPerson,
  ): Promise<Housing | null> {
    if (data?.api === 'v1') {
      return data.rawData
        ? {
            domicileId: data.rawData.Fjolsknr,
            address: {
              code: data.rawData.LoghHusk,
              lastUpdated: data.rawData.LoghHuskBreytt,
              streetAddress: data.rawData.Logheimili,
              city: data.rawData.LogheimiliSveitarfelag,
              postalCode: data.rawData.Postnr,
            },
          }
        : null
    }
    return await this.v3.getHousing(nationalId, data?.rawData)
  }

  async getSpouse(
    nationalId: string,
    data?: SharedPerson,
  ): Promise<Spouse | null> {
    if (data?.api === 'v1') {
      return data.rawData
        ? {
            name: data.rawData?.nafnmaka,
            nationalId: data.rawData?.MakiKt,
            maritalStatus: mapMaritalStatus(data.rawData?.hju),
            cohabitant: data.rawData?.Sambudarmaki,
          }
        : null
    }
    return await this.v3.getSpouse(nationalId, data?.rawData)
  }
}
