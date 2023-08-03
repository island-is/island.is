import { Inject, Injectable} from '@nestjs/common'
import { SoffiaService } from './v1/soffia.service'
import { BrokerService } from './v3/broker.service'
import { PersonV1, SharedPerson } from './shared/types'
import { Birthplace, Citizenship, Spouse, Housing } from './shared/models'
import { mapGender, mapMaritalStatus } from './shared/mapper'
import { LOGGER_PROVIDER, type Logger  } from '@island.is/logging'
import { Name } from './shared/models/name.model'

@Injectable()
export class NationalRegistryService {
  constructor(
    private readonly v1: SoffiaService,
    private readonly v3: BrokerService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}
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
      const children = await this.v1.getChildren(nationalId)
      return await Promise.all(children.map(c => this.v1.getPerson(c.nationalId)))
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

  async getName(
    nationalId: string,
    data?: SharedPerson,
  ): Promise<Name | null> {
    if (data?.api === 'v1') {
      if (data.rawData) {
        return {
            firstName: data.rawData.Eiginnafn,
            middleName: data.rawData.Millinafn,
            lastName: data.rawData.Kenninafn
          }
        }

      return null
    }
    return await this.v3.getName(nationalId, data?.rawData)
  }

  async getSpouse(
    nationalId: string,
    data?: SharedPerson,
  ): Promise<Spouse | null> {
    if (data?.api === 'v1') {
      if (data.rawData?.nafnmaka && data.rawData?.MakiKt) {
        return {
            fullName: data.rawData?.nafnmaka,
            nationalId: data.rawData?.MakiKt,
            maritalStatus: mapMaritalStatus(data.rawData?.hju),
            cohabitant: data.rawData?.Sambudarmaki,
          }
        }

      return null
    }


    return this.v3.getSpouse(nationalId, data?.rawData)
  }
}
