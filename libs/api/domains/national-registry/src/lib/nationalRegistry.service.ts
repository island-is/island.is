import { Injectable, Inject } from '@nestjs/common'

import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { SoffiaService } from './v1/soffia.service'
import { BrokerService } from './v3/broker.service'
import { PersonV3, SharedPerson } from './shared/types'
import { Birthplace, Citizenship, LivingArrangement, Religion, Spouse } from './shared/models'
import { userInfo } from 'os'
import { mapMaritalStatus } from './shared/mapper'
import { Housing } from './shared/models/housing.model'

@Injectable()
export class NationalRegistryService {
  constructor(
    private v1: SoffiaService,
    private v3: BrokerService
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}
    getUser(nationalId: string, api: 'v1' | 'v3')  {
      if (api === 'v3') {
        return null
      }
      return await this.v1.getUser(nationalId )
    }

    getPerson(nationalId: string, api: 'v1' | 'v3') {
      return api === 'v3' ? await this.v3.getPerson(nationalId) : await this.v1.getPerson(nationalId)
    }

    getFamily(nationalId: string, data?: SharedPerson) {
      if (data?.api === 'v3') {
        return null
      }
      return await this.v1.getFamily(nationalId)
    }

    getFamilyMember(nationalId: string, familyMemberNationalId: string, data?: SharedPerson)  {
      if (data?.api === 'v3') {
        return null
      }
      return await this.v1.getFamilyMemberDetails(nationalId, familyMemberNationalId)
    }

    getChildren(nationalId: string, data?: SharedPerson)  {
      if (data?.api === 'v3') {
        return null
      }
      return await this.v1.getChildren(nationalId)
    }

    getChildCustody(nationalId: string, data?: SharedPerson)  {
      if (data?.api === 'v1' ) {
        return null
      }
      return await this.v3.getChildrenCustodyInformation(nationalId, data?.rawData)
    }

    getCustodians(nationalId: string, data?: SharedPerson) {
      if (data?.api === 'v1') {
        return null
      }
      return await this.v3.getCustodians(nationalId, data?.rawData)
    }

    getParents(nationalId: string, data?: SharedPerson)  {
      if (data?.api === 'v1' ) {
        return null
      }
      return await this.v3.getParents(nationalId, data?.rawData)
    }

    getBirthplace(nationalId: string, data?: SharedPerson): Birthplace | null {
      if (data?.api === 'v1' ) {
          return data.rawData ? {
            location: data.rawData?.Faedingarstadur ?? null,
            municipalityText: data.rawData?.Faedingarstadur,
            dateOfBirth: data.rawData?.Faedingardagur ? new Date(data.rawData.Faedingardagur) : null
          } : null
      }
      return await this.v3.getBirthplace(nationalId, data?.rawData)
    }

    getCitizenship(nationalId: string, data?: SharedPerson): Citizenship | null {
      if (data?.api === 'v1' ) {
          return data.rawData ? {
            code: data.rawData.Rikisfang ?? null,
            name: data.rawData.RikisfangLand ?? null,
          } : null
      }
      return await this.v3.getCitizenship(nationalId, data?.rawData)
    }

    getHousing(nationalId: string, data?: SharedPerson): Housing| null {
      if (data?.api === 'v1' ) {
          return data.rawData ? {
            domicileId: data.rawData.Fjolsknr,
            address: {
              code: data.rawData.LoghHusk,
              lastUpdated: data.rawData.LoghHuskBreytt,
              streetAddress: data.rawData.Logheimili,
              city: data.rawData.LogheimiliSveitarfelag,
              postalCode: data.rawData.Postnr,
            },
          } : null
      }
      return await this.v3.getLivingArrangement(nationalId, data?.rawData)
    }

    getSpouse(nationalId: string, data?: SharedPerson): Spouse| null {
      if (data?.api === 'v1' ) {
          return data.rawData ? {
            fullName: data.rawData?.nafnmaka,
            nationalId: data.rawData?.MakiKt,
            maritalStatus: mapMaritalStatus(data.rawData?.hju),
            cohabitant: data.rawData?.Sambudarmaki,
          } : null
      }
      return await this.v3.getSpouse(nationalId, data?.rawData)
    }

}
