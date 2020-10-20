import { NotFoundException } from '@nestjs/common';
import { arrayUnique } from 'class-validator';
import Soap from 'soap'
import { MyInfo } from '../myInfo.model';
import { GetViewHusaskraDto } from './dto/getViewHusaskraDto';
import { GetViewKennitalaOgTrufelag } from './dto/getViewKennitalaOgTrufelag';
import { GetViewSveitarfelagDto } from './dto/getViewSveitarfelagDto';
import { GetViewThjodskraDto } from './dto/getViewThjodskraDto';

export class NationalRegistryApi {
  private readonly client: Soap.Client
  private readonly clientUser: string
  private readonly clientPassword: string

  constructor(private soapClient: Soap.Client,
    clientPassword: string, clientUser: string) {
    this.client = soapClient
    this.clientUser = clientUser
    this.clientPassword = clientPassword
  }

  public async getMyInfo(nationalId: string): Promise<MyInfo | null> {
    const response = await this.getViewThjodskra(nationalId)

    if (!response) throw new NotFoundException(`user with nationalId ${nationalId} not found in national Registry`)

    const userInfo = response.table.diffgram.DocumentElement.Thjodskra

    //GetViewHusaskra
    const houseResponse = await this.getViewHusaskra(userInfo.LoghHusk)
    //GetViewKennitalaOgTrufelag
    const religionResponse = await this.getViewKennitalaOgTrufelag(nationalId)
    //GetSambud?
    //GetViewSveitarfelag
    const birthPlaceResponse = await this.getViewSveitarfelag(userInfo.Faedsvfnr)

    return {
      fullName: userInfo.Nafn,
      citizenship: userInfo.Rikisfang,
      gender: userInfo.Kyn,
      birthPlace: this.formatBirthPlaceString(birthPlaceResponse),
      religion: this.formatReligionString(religionResponse),
      legalResidence: this.formatResidenceAddressString(houseResponse),
      maritalStatus: userInfo.Hju,
      banMarking: 'not implemented'
    }
  }

  private formatResidenceAddressString(houseDto: GetViewHusaskraDto | null): string {
    if (!houseDto) return "address not found"
    const houseInfo = houseDto.table.diffgram.DocumentElement.Husaskra
    return `${houseInfo.HusHeiti}, ${houseInfo.PostNr} ${houseInfo.Nafn}`
  }

  private formatReligionString(religtionDto: GetViewKennitalaOgTrufelag | null): string {
    if (!religtionDto) return "religion info not found"
    religtionDto?.table.diffgram.DocumentElement.KennitalaOgTrufelag.Trufelag
    return religtionDto.table.diffgram.DocumentElement.KennitalaOgTrufelag.Trufelag
  }

  private formatBirthPlaceString(birthPlaceDto: GetViewSveitarfelagDto | null): string {
    if (!birthPlaceDto) return "birth place not found"
    return birthPlaceDto.table.diffgram.DocumentElement.Sveitarfelag.Sokn
  }

  private formatGender(genderIndex: string): string {
    switch (genderIndex) {
      case "1":
        return "Karl"
      case "2":
        return "Kona"
      case "3":
        return "Drengur"
      case "4":
        return "Stúlka"
      default:
        return genderIndex
    }
  }

  public async getViewThjodskra(nationalId: string): Promise<GetViewThjodskraDto | null> {
    return await new Promise((resolve, _reject) => {
      this.client.GetViewThjodskra({
        ":SortColumn": 1,
        ":SortAscending": true,
        ":S5Username": this.clientUser,
        ":S5Password": this.clientPassword,
        ":Kennitala": nationalId,
      }, (err: any, { GetViewThjodskraResult: result }: { GetViewThjodskraResult: GetViewThjodskraDto }) => {
        if (err) {
          _reject(err);
        }

        resolve(result);
      });
    });
  }

  public async getViewHusaskra(houseCode: string): Promise<GetViewHusaskraDto | null> {
    console.log('get husaskra')
    return await new Promise((resolve, _reject) => {
      this.client.GetViewHusaskra({
        ":SortColumn": 1,
        ":SortAscending": true,
        ":S5Username": this.clientUser,
        ":S5Password": this.clientPassword,
        ":HusKodi": houseCode,
      }, (err: any, { GetViewHusaskraResult: result }: { GetViewHusaskraResult: GetViewHusaskraDto }) => {
        if (err) {
          console.log(err)
          _reject(err);
        }
        console.log('response ', result)
        resolve(result);
      });
    });
  }

  public async getViewKennitalaOgTrufelag(nationalId: string): Promise<GetViewKennitalaOgTrufelag | null> {
    return await new Promise((resolve, _reject) => {
      this.client.GetViewKennitalaOgTrufelag({
        ":SortColumn": 1,
        ":SortAscending": true,
        ":S5Username": this.clientUser,
        ":S5Password": this.clientPassword,
        ":Kennitala": nationalId,
      }, (err: any, { GetViewKennitalaOgTrufelagResult: result }: { GetViewKennitalaOgTrufelagResult: GetViewKennitalaOgTrufelag }) => {
        if (err) {
          console.log(err)
          _reject(err);
        }
        console.log(JSON.stringify(result))
        resolve(result);
      });
    });
  }

  public async getViewSveitarfelag(municipalCode: string): Promise<GetViewSveitarfelagDto | null> {
    return await new Promise((resolve, _reject) => {
      this.client.GetViewSveitarfelag({
        ":SortColumn": 1,
        ":SortAscending": true,
        ":S5Username": this.clientUser,
        ":S5Password": this.clientPassword,
        ":SvfNr": municipalCode,
      }, (err: any, { GetViewSveitarfelagResult: result }: { GetViewSveitarfelagResult: GetViewSveitarfelagDto }) => {
        if (err) {
          console.log(err)
          _reject(err);
        }
        resolve(result);
      });
    });
  }

  //GetViewFjolskyldan
}
