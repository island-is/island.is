import { InternalServerErrorException, NotFoundException } from '@nestjs/common'
import * as kennitala from 'kennitala'
import Soap from 'soap'

import { logger } from '@island.is/logging'
import {
  GetViewBanmarkingDto,
  GetViewHomeDto,
  GetViewReligionDto,
  GetViewMunicipalityDto,
  GetViewRegistryDto,
  Fjolskyldan,
  GetViewFamilyDto,
} from './dto'
import {
  FamilyMember,
  User,
  FamilyRelation,
  Gender,
  MaritalStatus,
  BanMarking,
} from '../types'

export class NationalRegistryApi {
  private readonly client: Soap.Client | null
  private readonly clientUser: string
  private readonly clientPassword: string
  private readonly ADULT_AGE_LIMIT = 18
  constructor(
    private soapClient: Soap.Client | null,
    clientPassword: string,
    clientUser: string,
  ) {
    if (!soapClient) {
      logger.error('NationalRegistry Soap client not initialized')
    }
    if (!clientUser) {
      logger.error('NationalRegistry user not provided')
    }
    if (!clientPassword) {
      logger.error('NationalRegistry password not provided')
    }

    this.client = soapClient
    this.clientUser = clientUser
    this.clientPassword = clientPassword
  }

  public async getReligion(nationalId: User['nationalId']): Promise<string> {
    const response: GetViewReligionDto = await this.signal(
      'GetViewKennitalaOgTrufelag',
      { Kennitala: nationalId },
    )
    if (!response) {
      return ''
    }

    return response.table.diffgram.DocumentElement.KennitalaOgTrufelag.Trufelag
  }

  public async getBirthPlace(
    municipalCode: User['municipalCode'],
  ): Promise<string> {
    const response: GetViewMunicipalityDto = await this.signal(
      'GetViewSveitarfelag',
      { SvfNr: municipalCode },
    )

    if (!response) {
      return ''
    }
    return response.table.diffgram.DocumentElement.Sveitarfelag.Sokn
  }

  public async getBanMarking(
    nationalId: User['nationalId'],
  ): Promise<BanMarking | null> {
    const response: GetViewBanmarkingDto = await this.signal(
      'GetViewKennitalaOgBannmerking',
      { Kennitala: nationalId },
    )

    if (!response) {
      return null
    }

    const banMarking =
      response.table.diffgram.DocumentElement.KennitalaOgBannmerking

    return {
      banMarked: banMarking.Bannmerking === '1',
      startDate: banMarking.Brdagur ?? '',
    }
  }

  public async getLegalResidence(
    houseCode: User['houseCode'],
  ): Promise<string> {
    const response: GetViewHomeDto = await this.signal('GetViewHusaskra', {
      HusKodi: houseCode,
    })
    if (!response) {
      return ''
    }
    const houseInfo = response.table.diffgram.DocumentElement.Husaskra
    return `${houseInfo.HusHeiti}, ${houseInfo.PostNr} ${houseInfo.Nafn}`
  }

  public async getMyInfo(nationalId: User['nationalId']): Promise<User> {
    const response: GetViewRegistryDto = await this.signal('GetViewThjodskra', {
      Kennitala: nationalId,
    })

    if (!response)
      throw new NotFoundException(
        `user with nationalId ${nationalId} not found in national Registry`,
      )

    const userInfo = response.table.diffgram.DocumentElement.Thjodskra
    return {
      nationalId,
      fullName: userInfo.Nafn,
      citizenship: userInfo.Rikisfang,
      gender: this.formatGender(userInfo.Kyn),
      maritalStatus: this.formatMaritalStatus(userInfo.Hju),
      houseCode: userInfo.LoghHusk,
      municipalCode: userInfo.Faedsvfnr,
    }
  }

  public async getMyFamily(nationalId: string): Promise<FamilyMember[]> {
    const response: GetViewFamilyDto = await this.signal('GetViewFjolskyldan', {
      Kennitala: nationalId,
    })

    if (!response)
      throw new NotFoundException(
        `family for nationalId ${nationalId} not found`,
      )

    const family = Array.isArray(
      response?.table.diffgram.DocumentElement.Fjolskyldan,
    )
      ? response?.table.diffgram.DocumentElement.Fjolskyldan
      : [response?.table.diffgram.DocumentElement.Fjolskyldan]

    if (!family)
      throw new NotFoundException(
        `family for nationalId ${nationalId} not found`,
      )

    const members = family
      .filter((familyMember) => {
        return familyMember.Kennitala !== nationalId
      })
      .map(
        (familyMember) =>
          ({
            fullName: familyMember.Nafn,
            nationalId: familyMember.Kennitala,
            gender: this.formatGender(familyMember.KynKodi),
            maritalStatus: this.formatMaritalStatus(familyMember.Hjusk),
            familyRelation: this.getFamilyRelation(familyMember),
            address: `${familyMember.Husheiti}, ${familyMember.Pnr} ${familyMember.Sveitarfelag}`,
          } as FamilyMember),
      )
      .sort((a, b) => {
        return (
          kennitala.info(b.nationalId).age - kennitala.info(a.nationalId).age
        )
      })

    return members
  }

  private getFamilyRelation(person: Fjolskyldan): FamilyRelation {
    if (this.isChild(person)) return FamilyRelation.CHILD
    return FamilyRelation.SPOUSE
  }

  private isParent(person: Fjolskyldan): boolean {
    return ['1', '2'].includes(person.Kyn)
  }

  private isChild(person: Fjolskyldan): boolean {
    return (
      !this.isParent(person) &&
      kennitala.info(person.Kennitala).age < this.ADULT_AGE_LIMIT
    )
  }

  private formatMaritalStatus(maritalCode: string): MaritalStatus {
    switch (maritalCode) {
      case '1':
        return MaritalStatus.UNMARRIED
      case '3':
        return MaritalStatus.MARRIED
      case '4':
        return MaritalStatus.WIDOWED
      case '5':
        return MaritalStatus.SEPARATED
      case '6':
        return MaritalStatus.DIVORCED
      case '7':
        return MaritalStatus.MARRIED_LIVING_SEPARATELY
      case '8':
        return MaritalStatus.MARRIED_TO_FOREIGN_LAW_PERSON
      case '9':
        return MaritalStatus.UNKNOWN
      case '0':
        return MaritalStatus.FOREIGN_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON
      case 'L':
        return MaritalStatus.ICELANDIC_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON
      default:
        return MaritalStatus.UNKNOWN
    }
  }

  private formatGender(genderIndex: string): Gender {
    switch (genderIndex) {
      case '1':
        return Gender.MALE
      case '2':
        return Gender.FEMALE
      case '3':
        return Gender.MALE_MINOR
      case '4':
        return Gender.FEMALE_MINOR
      case '7':
        return Gender.TRANSGENDER
      case '8':
        return Gender.TRANSGENDER_MINOR
      default:
        return Gender.UNKNOWN
    }
  }

  private async signal(
    functionName: string,
    args: Record<string, string>,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        throw new InternalServerErrorException('Client not initialized')
      }

      this.client[functionName](
        {
          ':SortColumn': 1,
          ':SortAscending': true,
          ':S5Username': this.clientUser,
          ':S5Password': this.clientPassword,
          ...Object.keys(args).reduce(
            (acc: Record<string, string>, key: string) => ({
              ...acc,
              [`:${key}`]: args[key],
            }),
            {},
          ),
        },
        (
          // eslint-disable-next-line
          error: any,
          response: any,
        ) => {
          const result = response[`${functionName}Result`]
          if (result != null) {
            if (!result.success) {
              logger.error(result.message)
              reject(result)
            }
            if (error) {
              logger.error(error)
              reject(error)
            }
            resolve(result.table.diffgram ? result : null)
          }
          resolve(null)
        },
      )
    })
  }
}
