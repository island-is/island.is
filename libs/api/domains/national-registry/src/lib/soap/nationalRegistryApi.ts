import { NotFoundException } from '@nestjs/common'
import { logger } from '@island.is/logging'
import Soap from 'soap'
import { MyInfo } from '../myInfo.model'
import { GetViewHusaskraDto } from './dto/getViewHusaskraDto'
import { GetViewKennitalaOgTrufelag } from './dto/getViewKennitalaOgTrufelag'
import { GetViewSveitarfelagDto } from './dto/getViewSveitarfelagDto'
import { GetViewThjodskraDto } from './dto/getViewThjodskraDto'
import { GetViewFjolskyldanDto } from './dto/getViewFjolskyldanDto'
import { FamilyMember } from '../familyMember.model'

export class NationalRegistryApi {
  private readonly client: Soap.Client
  private readonly clientUser: string
  private readonly clientPassword: string

  constructor(
    private soapClient: Soap.Client,
    clientPassword: string,
    clientUser: string,
  ) {
    this.client = soapClient
    this.clientUser = clientUser
    this.clientPassword = clientPassword
  }

  public async getMyInfo(nationalId: string): Promise<MyInfo | null> {
    const response = await this.getViewThjodskra(nationalId)

    if (!response)
      throw new NotFoundException(
        `user with nationalId ${nationalId} not found in national Registry`,
      )

    const userInfo = response.table.diffgram.DocumentElement.Thjodskra
    const houseResponse = await this.getViewHusaskra(userInfo.LoghHusk)
    const religionResponse = await this.getViewKennitalaOgTrufelag(nationalId)
    const birthPlaceResponse = await this.getViewSveitarfelag(
      userInfo.Faedsvfnr,
    )

    return {
      fullName: userInfo.Nafn,
      citizenship: userInfo.Rikisfang === 'IS' ? 'Ísland' : userInfo.Rikisfang,
      gender: this.formatGender(userInfo.Kyn),
      birthPlace: this.formatBirthPlaceString(birthPlaceResponse),
      religion: this.formatReligionString(religionResponse),
      legalResidence: this.formatResidenceAddressString(houseResponse),
      maritalStatus: this.formatMartialStatus(userInfo.Hju, userInfo.Kyn),
      banMarking: 'not implemented',
    }
  }

  public async getMyFamily(nationalId: string): Promise<FamilyMember[] | null> {
    const response = await this.getViewFjolskyldan(nationalId)
    if (!response)
      throw new NotFoundException(
        `family for nationalId ${nationalId} not found`,
      )

    const family = response?.table.diffgram.DocumentElement.Fjolskyldan

    if (!family)
      throw new NotFoundException(
        `family for nationalId ${nationalId} not found`,
      )

    const members = family.map(
      (x) =>
        ({
          fullName: x.Nafn,
          nationalId: x.Kennitala,
          gender: x.Kyn + x.KynKodi,
          maritalStatus: x.Hjuskapur,
          address: `${x.Husheiti}, ${x.Pnr} ${x.Sveitarfelag}`,
        } as FamilyMember),
    )

    return members
  }

  private formatResidenceAddressString(
    houseDto: GetViewHusaskraDto | null,
  ): string {
    if (!houseDto) return 'address not found'
    const houseInfo = houseDto.table.diffgram.DocumentElement.Husaskra
    return `${houseInfo.HusHeiti}, ${houseInfo.PostNr} ${houseInfo.Nafn}`
  }

  private formatReligionString(
    religtionDto: GetViewKennitalaOgTrufelag | null,
  ): string {
    if (!religtionDto) return 'religion info not found'
    religtionDto?.table.diffgram.DocumentElement.KennitalaOgTrufelag.Trufelag
    return religtionDto.table.diffgram.DocumentElement.KennitalaOgTrufelag
      .Trufelag
  }

  private formatBirthPlaceString(
    birthPlaceDto: GetViewSveitarfelagDto | null,
  ): string {
    if (!birthPlaceDto) return 'birth place not found'
    return birthPlaceDto.table.diffgram.DocumentElement.Sveitarfelag.Sokn
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
        return maritalCode
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
        return genderIndex
    }
  }

  public async getViewThjodskra(
    nationalId: string,
  ): Promise<GetViewThjodskraDto | null> {
    return await new Promise((resolve, _reject) => {
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
          }: { GetViewThjodskraResult: GetViewThjodskraDto },
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
  ): Promise<GetViewHusaskraDto | null> {
    return await new Promise((resolve, _reject) => {
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
          }: { GetViewHusaskraResult: GetViewHusaskraDto },
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
  ): Promise<GetViewKennitalaOgTrufelag | null> {
    return await new Promise((resolve, _reject) => {
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
          }: { GetViewKennitalaOgTrufelagResult: GetViewKennitalaOgTrufelag },
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
  ): Promise<GetViewSveitarfelagDto | null> {
    return await new Promise((resolve, _reject) => {
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
          }: { GetViewSveitarfelagResult: GetViewSveitarfelagDto },
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
  ): Promise<GetViewFjolskyldanDto | null> {
    return await new Promise((resolve, _reject) => {
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
          }: { GetViewFjolskyldanResult: GetViewFjolskyldanDto },
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
