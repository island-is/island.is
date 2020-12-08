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
import { FamilyMember, User, FamilyRelation } from '../types'

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
    const response = await this.getViewKennitalaOgTrufelag(nationalId)
    if (!response) {
      return ''
    }

    return response.table.diffgram.DocumentElement.KennitalaOgTrufelag.Trufelag
  }

  public async getBirthPlace(
    municipalCode: User['municipalCode'],
  ): Promise<string> {
    const response = await this.getViewSveitarfelag(municipalCode)

    if (!response) {
      return ''
    }
    return response.table.diffgram.DocumentElement.Sveitarfelag.Sokn
  }

  public async getBanMarking(nationalId: User['nationalId']): Promise<string> {
    const response = await this.getViewKennitalaOgBannmerking(nationalId)

    if (!response) {
      return ''
    }

    const banMarking =
      response.table.diffgram.DocumentElement.KennitalaOgBannmerking
    const isBanmarked = banMarking.Bannmerking === '1'
    return isBanmarked ? `Já ${banMarking.Brdagur}` : 'Nei'
  }

  public async getLegalResidence(
    houseCode: User['houseCode'],
  ): Promise<string> {
    const response = await this.getViewHusaskra(houseCode)
    if (!response) {
      return ''
    }
    const houseInfo = response.table.diffgram.DocumentElement.Husaskra
    return `${houseInfo.HusHeiti}, ${houseInfo.PostNr} ${houseInfo.Nafn}`
  }

  public async getMyInfo(nationalId: User['nationalId']): Promise<User> {
    const response = await this.getViewThjodskra(nationalId)

    if (!response)
      throw new NotFoundException(
        `user with nationalId ${nationalId} not found in national Registry`,
      )

    const userInfo = response.table.diffgram.DocumentElement.Thjodskra
    return {
      nationalId,
      fullName: userInfo.Nafn,
      citizenship: userInfo.Rikisfang === 'IS' ? 'Ísland' : userInfo.Rikisfang,
      gender: this.formatGender(userInfo.Kyn),
      maritalStatus: this.formatMartialStatus(userInfo.Hju, userInfo.Kyn),
      houseCode: userInfo.LoghHusk,
      municipalCode: userInfo.Faedsvfnr,
    }
  }

  public async getMyFamily(nationalId: string): Promise<FamilyMember[]> {
    const response = await this.getViewFjolskyldan(nationalId)

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
            gender: familyMember.Kyn,
            maritalStatus: familyMember.Hjuskapur,
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

  private formatMartialStatus(maritalCode: string, genderCode: string): string {
    const isMale = genderCode === '1'
    switch (maritalCode) {
      case '1':
        return isMale ? 'Ógiftur' : 'Ógift'
      case '3':
        return isMale
          ? 'Giftur eða staðfest samvist'
          : 'Gift eða staðfest samvist'
      case '4':
        return isMale ? 'Ekkill' : 'Ekkja'
      case '5':
        return `Skilin${isMale ? 'n' : ''} að borði og sæng`
      case '6':
        return `Skilin${isMale ? 'n' : ''} að lögum`
      case '7':
        return 'Hjón ekki í samvistum'
      case '8':
        return 'Íslendingur í hjúskap með útlendingi sem nýtur úrlendisréttar og verður því ekki skráður (t.d. varnarliðsmaður eða sendiráðsmaður)'
      case '9':
        return 'Hjúskaparstaða óupplýst'
      case '0':
        return 'Íslendingur með lögheimili erlendis; í hjúskap með útlendingi sem ekki er á skrá'
      case 'L':
        return 'Íslendingur með lögheimili á Íslandi (t.d. námsmaður eða sendiráðsmaður); í hjúskap með útlendingi sem ekki er á skrá'
      default:
        return ''
    }
  }

  private formatGender(genderIndex: string): string {
    switch (genderIndex) {
      case '1':
        return 'Karl'
      case '2':
        return 'Kona'
      case '3':
        return 'Drengur'
      case '4':
        return 'Stúlka'
      case '7':
        return 'Kynsegin'
      case '8':
        return 'Kynsegin'
      default:
        return ''
    }
  }

  public async getViewThjodskra(
    nationalId: string,
  ): Promise<GetViewRegistryDto | null> {
    return await new Promise((resolve, _reject) => {
      if (!this.client)
        throw new InternalServerErrorException('Client not initialized')
      this.client.GetViewThjodskra(
        {
          ':SortColumn': 1,
          ':SortAscending': true,
          ':S5Username': this.clientUser,
          ':S5Password': this.clientPassword,
          ':Kennitala': nationalId,
        },
        (
          // eslint-disable-next-line
          error: any,
          {
            GetViewThjodskraResult: result,
          }: { GetViewThjodskraResult: GetViewRegistryDto },
        ) => {
          if (result != null) {
            if (!result.success) {
              logger.error(result.message)
              _reject(result)
            }
            if (error) {
              logger.error(error)
              _reject(error)
            }
            resolve(result.table.diffgram ? result : null)
          }
          resolve(null)
        },
      )
    })
  }

  public async getViewHusaskra(
    houseCode: string,
  ): Promise<GetViewHomeDto | null> {
    return await new Promise((resolve, _reject) => {
      if (!this.client)
        throw new InternalServerErrorException('Client not initialized')
      this.client.GetViewHusaskra(
        {
          ':SortColumn': 1,
          ':SortAscending': true,
          ':S5Username': this.clientUser,
          ':S5Password': this.clientPassword,
          ':HusKodi': houseCode,
        },
        (
          // eslint-disable-next-line
          error: any,
          {
            GetViewHusaskraResult: result,
          }: { GetViewHusaskraResult: GetViewHomeDto },
        ) => {
          if (result != null) {
            if (!result.success) {
              logger.error(result.message)
              _reject(result)
            }
            if (error) {
              logger.error(error)
              _reject(error)
            }
            resolve(result.table.diffgram ? result : null)
          }
          resolve(null)
        },
      )
    })
  }

  public async getViewKennitalaOgTrufelag(
    nationalId: string,
  ): Promise<GetViewReligionDto | null> {
    return await new Promise((resolve, _reject) => {
      if (!this.client)
        throw new InternalServerErrorException('Client not initialized')
      this.client.GetViewKennitalaOgTrufelag(
        {
          ':SortColumn': 1,
          ':SortAscending': true,
          ':S5Username': this.clientUser,
          ':S5Password': this.clientPassword,
          ':Kennitala': nationalId,
        },
        (
          // eslint-disable-next-line
          error: any,
          {
            GetViewKennitalaOgTrufelagResult: result,
          }: { GetViewKennitalaOgTrufelagResult: GetViewReligionDto },
        ) => {
          if (result != null) {
            if (!result.success) {
              logger.error(result.message)
              _reject(result)
            }
            if (error) {
              logger.error(error)
              _reject(error)
            }
            resolve(result.table.diffgram ? result : null)
          }
          resolve(null)
        },
      )
    })
  }

  public async getViewSveitarfelag(
    municipalCode: string,
  ): Promise<GetViewMunicipalityDto | null> {
    return await new Promise((resolve, _reject) => {
      if (!this.client)
        throw new InternalServerErrorException('Client not initialized')
      this.client.GetViewSveitarfelag(
        {
          ':SortColumn': 1,
          ':SortAscending': true,
          ':S5Username': this.clientUser,
          ':S5Password': this.clientPassword,
          ':SvfNr': municipalCode,
        },
        (
          // eslint-disable-next-line
          error: any,
          {
            GetViewSveitarfelagResult: result,
          }: { GetViewSveitarfelagResult: GetViewMunicipalityDto },
        ) => {
          if (result != null) {
            if (!result.success) {
              logger.error(result.message)
              _reject(result)
            }
            if (error) {
              logger.error(error)
              _reject(error)
            }
            resolve(result.table.diffgram ? result : null)
          }
          resolve(null)
        },
      )
    })
  }

  public async getViewFjolskyldan(
    nationalId: string,
  ): Promise<GetViewFamilyDto | null> {
    return await new Promise((resolve, _reject) => {
      if (!this.client)
        throw new InternalServerErrorException('Client not initialized')
      this.client.GetViewFjolskyldan(
        {
          ':SortColumn': 1,
          ':SortAscending': true,
          ':S5Username': this.clientUser,
          ':S5Password': this.clientPassword,
          ':Kennitala': nationalId,
        },
        (
          // eslint-disable-next-line
          error: any,
          {
            GetViewFjolskyldanResult: result,
          }: { GetViewFjolskyldanResult: GetViewFamilyDto },
        ) => {
          if (result != null) {
            if (!result.success) {
              logger.error(result.message)
              _reject(result)
            }
            if (error) {
              logger.error(error)
              _reject(error)
            }
            resolve(result.table.diffgram ? result : null)
          }
          resolve(null)
        },
      )
    })
  }

  public async getViewKennitalaOgBannmerking(
    nationalId: string,
  ): Promise<GetViewBanmarkingDto | null> {
    return await new Promise((resolve, _reject) => {
      if (!this.client)
        throw new InternalServerErrorException('Client not initialized')
      this.client.GetViewKennitalaOgBannmerking(
        {
          ':SortColumn': 1,
          ':SortAscending': true,
          ':S5Username': this.clientUser,
          ':S5Password': this.clientPassword,
          ':Kennitala': nationalId,
        },
        (
          // eslint-disable-next-line
          error: any,
          {
            GetViewKennitalaOgBannmerkingResult: result,
          }: {
            GetViewKennitalaOgBannmerkingResult: GetViewBanmarkingDto
          },
        ) => {
          if (result != null) {
            if (!result.success) {
              logger.error(result.message)
              _reject(result)
            }
            if (error) {
              logger.error(error)
              _reject(error)
            }
            resolve(result.table.diffgram ? result : null)
          }
          resolve(null)
        },
      )
    })
  }
}
