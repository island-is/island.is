import { Injectable } from '@nestjs/common'

import { AuthMiddleware, User, Auth } from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'

import { ApiResponse, EinstaklingarApi, LyklarApi } from '../../gen/fetch'
import { formatIndividualDto, IndividualDto } from './types/individual.dto'
import {
  CohabitationDto,
  formatCohabitationDto,
} from './types/cohabitation.dto'
import {
  formatResidenceHistoryEntryDto,
  ResidenceHistoryEntryDto,
} from './types/residence-history-entry.dto'
import { FamilyDto, formatFamilyDto } from './types/family.dto'
import { BirthplaceDto, formatBirthplaceDto } from './types/birthplace.dto'
import { CitizenshipDto, formatCitizenshipDto } from './types/citizenship.dto'
import { formatReligionDto, ReligionDto } from './types/religion.dto'

const MODERN_IGNORED_STATUS = 204

// Need to handle some legacy status codes. As of 2022-09-09:
const LEGACY_IGNORED_STATUSES = [
  // Future compatible.
  204,
  // /forsja and other endpoints in development.
  400,
  // /forsja in production at least.
  404,
]

@Injectable()
export class NationalRegistryClientService {
  constructor(
    private individualApi: EinstaklingarApi,
    private keysApi: LyklarApi,
  ) {}

  async getIndividual(nationalId: string): Promise<IndividualDto | null> {
    console.log('V2.getIndividual')
    const individual = await this.handleModernMissingData(
      this.individualApi.einstaklingarGetEinstaklingurRaw({
        id: nationalId,
      }),
    )
    console.log(individual)

    return formatIndividualDto(individual)
  }

  async getCustodyChildren(parentUser: User): Promise<string[]> {
    console.log('V2.getCustodyChildren')
    const response = await this.handleLegacyMissingData(
      this.individualApi
        .withMiddleware(new AuthMiddleware(parentUser))
        .einstaklingarGetForsjaRaw({ id: parentUser.nationalId }),
    )
    console.log(response)
    return response || []
  }

  async getChildResidenceParent(
    parentUser: User,
    childId: string,
  ): Promise<string[]> {
    console.log('V2.getChildResidenceParent')
    const response = await this.handleLegacyMissingData(
      this.individualApi
        .withMiddleware(new AuthMiddleware(parentUser))
        .einstaklingarGetBusetuForeldriRaw({ barn: childId }),
    )
    console.log(response)
    return response || []
  }

  async getChildDomicileParent(
    parentUser: User,
    childId: string,
  ): Promise<string[]> {
    console.log('V2.getChildDomicileParent')
    const response = await this.handleLegacyMissingData(
      this.individualApi
        .withMiddleware(new AuthMiddleware(parentUser))
        .einstaklingarGetLogheimilisForeldriRaw({ barn: childId }),
    )
    console.log(response)
    return response || []
  }

  async getOtherCustodyParents(
    parentUser: User,
    childId: string,
  ): Promise<string[]> {
    console.log('V2.getOtherCustodyParents')
    const response = await this.handleLegacyMissingData(
      this.individualApi
        .withMiddleware(new AuthMiddleware(parentUser))
        .einstaklingarGetForsjaForeldriRaw({
          id: parentUser.nationalId,
          barn: childId,
        }),
    )
    console.log(response)
    return response || []
  }

  async getCohabitationInfo(
    nationalId: string,
  ): Promise<CohabitationDto | null> {
    console.log('V2.getCohabitationInfo')
    const response = await this.handleLegacyMissingData(
      this.individualApi.einstaklingarGetHjuskapurRaw({
        id: nationalId,
      }),
    )
    console.log(response)
    return formatCohabitationDto(response)
  }

  async getResidenceHistory(
    nationalId: string,
  ): Promise<ResidenceHistoryEntryDto[]> {
    console.log('V2.getResidenceHistory')
    const residenceHistory = await this.handleLegacyMissingData(
      this.individualApi.einstaklingarGetBusetaRaw({ id: nationalId }),
    )
    console.log(residenceHistory)
    return (residenceHistory || []).map(formatResidenceHistoryEntryDto)
  }

  async getFamily(nationalId: string): Promise<FamilyDto | null> {
    console.log('V2.getFamily')
    const family = await this.handleLegacyMissingData(
      this.individualApi.einstaklingarGetFjolskyldumedlimirRaw({
        id: nationalId,
      }),
    )
    console.log(family)
    return formatFamilyDto(family)
  }

  async getBirthplace(nationalId: string): Promise<BirthplaceDto | null> {
    console.log('V2.getBirthplace')
    const birthplace = await this.handleLegacyMissingData(
      this.individualApi.einstaklingarGetFaedingarstadurRaw({ id: nationalId }),
    )
    console.log(birthplace)
    return formatBirthplaceDto(birthplace)
  }

  async getCitizenship(nationalId: string): Promise<CitizenshipDto | null> {
    console.log('V2.getCitizenship')
    const citizenship = await this.handleLegacyMissingData(
      this.individualApi.einstaklingarGetRikisfangRaw({ id: nationalId }),
    )
    console.log(citizenship)
    return formatCitizenshipDto(citizenship)
  }

  async getReligionCodes(): Promise<ReligionDto[] | null> {
    console.log('V2.getReligionCodes')
    const codes = await this.keysApi.lyklarGetTrufelog()
    console.log(codes)
    return formatReligionDto(codes)
  }

  private async handleLegacyMissingData<T>(
    promise: Promise<ApiResponse<T>>,
  ): Promise<T | null> {
    return promise.then(
      (response) => {
        if (LEGACY_IGNORED_STATUSES.includes(response.raw.status)) {
          return null
        }
        return response.value()
      },
      (error) => {
        if (
          error instanceof FetchError &&
          LEGACY_IGNORED_STATUSES.includes(error.status)
        ) {
          return null
        }
        throw error
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

  withManualAuth(auth: Auth): NationalRegistryClientService {
    return new NationalRegistryClientService(
      this.individualApi.withMiddleware(new AuthMiddleware(auth)),
      this.keysApi.withMiddleware(new AuthMiddleware(auth)),
    )
  }
}
