import { Injectable } from '@nestjs/common'

import { BirthdayIndividual, mapBirthdayIndividual } from './mappers'
import { EinstaklingarApi, IslandIsApi } from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  CohabitationDto,
  CohabitantsDetailedDto,
  formatCohabitantsDetailedDto,
  formatCohabitationDtoV3FromHju,
  formatCohabitationDtoV3FromSam,
} from './types/cohabitation.dto'
import {
  formatResidenceEntryDto,
  ResidenceEntryDto,
} from './types/residence-history-entry.dto'
import { formatFamilyDto, FamilyDto } from './types/family.dto'
import { formatBirthplaceDto, BirthplaceDto } from './types/birthplace.dto'
import { formatCitizenshipDto, CitizenshipDto } from './types/citizenship.dto'
import { formatIndividualDto } from './types/individual.dto'
import { IndividualDto } from './types/individual.dto'

@Injectable()
export class NationalRegistryV3ApplicationsClientService {
  constructor(
    private islandIsApi: IslandIsApi,
    private einstaklingarApi: EinstaklingarApi,
  ) {}

  private einstaklingarApiWithAuth(auth: Auth) {
    return this.einstaklingarApi.withMiddleware(new AuthMiddleware(auth))
  }

  async get18YearOlds(): Promise<Array<BirthdayIndividual>> {
    const res = await this.islandIsApi.islandIs18IDagGet()
    return (res.eins18IDagList ?? []).map(mapBirthdayIndividual)
  }

  async getMyCustodians(auth: User): Promise<string[]> {
    const res = await this.einstaklingarApiWithAuth(
      auth,
    ).einstaklingarKennitalaForsjaYfirGet({
      kennitala: auth.nationalId,
    })

    return (
      res.forsjaAdilarList?.map((x) => x.forsjaKt || '')?.filter((x) => !!x) ||
      []
    )
  }

  async getIndividual(
    nationalId: string,
    auth: User,
  ): Promise<IndividualDto | null> {
    console.log('--------------------------------')
    console.log('getIndividual nationalId', nationalId)
    // console.dir(auth, { depth: null })
    console.log('--------------------------------')
    const res = await this.einstaklingarApiWithAuth(
      auth,
    ).einstaklingarKennitalaGet({
      kennitala: nationalId,
    })
    console.log('--------------------------------')
    console.log('getIndividual')
    console.dir(formatIndividualDto(res), { depth: null })
    console.log('--------------------------------')

    return formatIndividualDto(res)
  }

  async getCustodyChildren(user: User): Promise<string[]> {
    const res = await this.einstaklingarApiWithAuth(
      user,
    ).einstaklingarKennitalaForsjaUndirGet({
      kennitala: user.nationalId,
    })

    console.log('--------------------------------')
    console.log('getCustodyChildren res')
    console.dir(res, { depth: null })
    console.log('--------------------------------')

    return (
      res.forsjaBornList?.map((x) => x.barnKt || '')?.filter((x) => !!x) || []
    )
  }

  async getLegalParents(user: User): Promise<string[]> {
    const res = await this.einstaklingarApiWithAuth(
      user,
    ).einstaklingarKennitalaForsjaYfirGet({
      kennitala: user.nationalId,
    })

    return (
      res.forsjaAdilarList?.map((x) => x.forsjaKt || '')?.filter((x) => !!x) ||
      []
    )
  }

  async getChildResidenceParent(
    auth: User,
    childId: string,
  ): Promise<string[]> {
    const res = await this.einstaklingarApiWithAuth(
      auth,
    ).einstaklingarKennitalaBusetuforeldriGet({
      kennitala: childId,
    })

    return (
      res.forsjaAdilarList?.map((x) => x.forsjaKt || '')?.filter((x) => !!x) ||
      []
    )
  }

  async getChildDomicileParent(
    parentUser: User,
    childId: string,
  ): Promise<string[]> {
    const res = await this.einstaklingarApiWithAuth(
      parentUser,
    ).einstaklingarKennitalaLogheimilisforeldriGet({
      kennitala: childId,
    })

    return (
      res.forsjaAdilarList?.map((x) => x.forsjaKt || '')?.filter((x) => !!x) ||
      []
    )
  }

  async getOtherCustodyParents(user: User, childId: string): Promise<string[]> {
    const res = await this.einstaklingarApiWithAuth(
      user,
    ).einstaklingarKennitalaForsjaYfirGet({
      kennitala: childId,
    })

    return (
      res.forsjaAdilarList?.map((x) => x.forsjaKt || '')?.filter((x) => !!x) ||
      []
    )
  }

  async getCohabitationInfo(
    nationalId: string,
    auth: User,
  ): Promise<CohabitationDto | null> {
    const res = await this.einstaklingarApiWithAuth(
      auth,
    ).einstaklingarKennitalaHjuskapurGet({
      kennitala: nationalId,
    })

    if (res.sambud?.sambud) {
      return formatCohabitationDtoV3FromSam(res.sambud, res.hjuskapur)
    } else if (res.hjuskapur && res.hjuskapur.kennitalaMaka) {
      return formatCohabitationDtoV3FromHju(res.hjuskapur)
    } else {
      return null
    }
  }

  async getCohabitants(nationalId: string, auth: User): Promise<string[]> {
    const res = await this.einstaklingarApiWithAuth(
      auth,
    ).einstaklingarKennitalaLogheimilistengslGet({
      kennitala: nationalId,
    })

    return (
      res.logheimilistengslmedlimir
        ?.map((x) => x.kennitala || '')
        ?.filter((x) => !!x) || []
    )
  }

  async getCohabitantsDetailed(
    nationalId: string,
    auth: User,
  ): Promise<CohabitantsDetailedDto | null> {
    const res = await this.einstaklingarApiWithAuth(
      auth,
    ).einstaklingarKennitalaLogheimilistengslItarGet({
      kennitala: nationalId,
    })

    return formatCohabitantsDetailedDto(res.logheimiliseinstaklingar)
  }

  async getCurrentResidence(
    nationalId: string,
    auth: User,
  ): Promise<ResidenceEntryDto | null> {
    const res = await this.einstaklingarApiWithAuth(
      auth,
    ).einstaklingarKennitalaLogheimiliGet({
      kennitala: nationalId,
    })

    return formatResidenceEntryDto(res)
  }

  async getResidenceHistory(
    nationalId: string,
    auth: User,
  ): Promise<ResidenceEntryDto[] | null> {
    console.log('--------------------------------')
    console.log('getResidenceHistory nationalId', nationalId)
    console.dir(auth, { depth: null })
    console.log('--------------------------------')
    const res = await this.einstaklingarApiWithAuth(
      auth,
    ).einstaklingarKennitalaBusetusagaGet({
      kennitala: nationalId,
    })

    console.log('--------------------------------')
    console.log('getResidenceHistory')
    console.dir(
      res
        .map((x) => formatResidenceEntryDto(x))
        .filter((x): x is ResidenceEntryDto => x !== null),
      { depth: null },
    )
    console.log('--------------------------------')

    return res
      .map((x) => formatResidenceEntryDto(x))
      .filter((x): x is ResidenceEntryDto => x !== null)
  }

  async getFamily(user: User): Promise<FamilyDto | null> {
    const homeInfo = await this.einstaklingarApiWithAuth(
      user,
    ).einstaklingarKennitalaLogheimilistengslItarGet({
      kennitala: user.nationalId,
    })

    return formatFamilyDto(homeInfo)
  }

  async getBirthplace(
    nationalId: string,
    auth: User,
  ): Promise<BirthplaceDto | null> {
    console.log('--------------------------------')
    console.log('getBirthplace nationalId', nationalId)
    console.dir(auth, { depth: null })
    console.log('--------------------------------')
    const res = await this.einstaklingarApiWithAuth(
      auth,
    ).einstaklingarKennitalaFaedingarstadurGet({
      kennitala: nationalId,
    })

    return formatBirthplaceDto(res)
  }

  async getCitizenship(
    nationalId: string,
    auth: User,
  ): Promise<CitizenshipDto | null> {
    const res = await this.einstaklingarApiWithAuth(
      auth,
    ).einstaklingarKennitalaRikisfangGet({
      kennitala: nationalId,
    })

    return formatCitizenshipDto(res)
  }
}
