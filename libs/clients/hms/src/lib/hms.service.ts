import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  Adalmatseining,
  AdalmatseiningApi,
  ApiFasteignByStadfangNrGetRequest,
  ApiStadfangSearchGetRequest,
  BaseAPI,
  FasteignApi,
  StadfangApi,
} from '../../gen/fetch'

@Injectable()
export class HmsService {
  constructor(
    private readonly stadfangApi: StadfangApi,
    private readonly fasteignApi: FasteignApi,
    private readonly adalmatseiningApi: AdalmatseiningApi,
  ) {}

  private apiWithAuth = <T extends BaseAPI>(api: T, user: User): T =>
    api.withMiddleware(new AuthMiddleware(user as Auth))

  async hmsSearch(user: User, input: ApiStadfangSearchGetRequest) {
    try {
      const res = await this.apiWithAuth(
        this.stadfangApi,
        user,
      ).apiStadfangSearchGet(input)

      if (!res) {
        return []
      }

      return res.map((item) => {
        return {
          addressCode: item.stadfangNr,
          address: item.stadfangBirting ?? undefined,
          municipalityName: item.sveitarfelagNafn ?? undefined,
          municipalityCode: item.sveitarfelagNr,
          postalCode: item.postnumer,
          landCode: item.landeignNr,
          streetName: item.stadvisir ?? undefined,
          streetNumber: item.stadgreinirNr,
          numOfConnectedProperties: item.fjoldiTengdraFasteigna,
        }
      })
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Unknown error'
      throw new Error(
        `Failed to retrieve data for searched adresses: ${errorMessage}`,
      )
    }
  }

  async hmsPropertyInfo(user: User, input: ApiFasteignByStadfangNrGetRequest) {
    try {
      const fasteignir = await this.apiWithAuth(
        this.fasteignApi,
        user,
      ).apiFasteignByStadfangNrGet(input)

      const adalmatseiningarPromise = fasteignir.reduce((acc, fasteign) => {
        if (fasteign.fasteignNr) {
          acc.push(
            this.apiWithAuth(
              this.adalmatseiningApi,
              user,
            ).apiAdalmatseiningByFasteignNrGet({
              fasteignNr: fasteign.fasteignNr,
            }),
          )
        }

        return acc
      }, [] as Promise<Adalmatseining[]>[])

      const adalMatseiningar = await Promise.all(adalmatseiningarPromise).then(
        (res) => res.flat(),
      )
      return fasteignir.map((fasteign) => {
        const adalmatseining = adalMatseiningar.filter(
          (a) => a.fasteignNr === fasteign.fasteignNr,
        )

        return {
          propertyCode: fasteign.fasteignNr,
          landCode: fasteign.landeignNr,
          addressCode: fasteign.stadfangNr,
          address: fasteign.stadfangBirting ?? undefined,
          postalCode: fasteign.postnumer,
          municipalityName: fasteign.sveitarfelagNafn ?? undefined,
          municipalityCode: fasteign.sveitarfelagNr,
          unitCode: fasteign.merking ?? undefined,
          propertyUsageDescription: fasteign.notkunTexti ?? undefined,
          size: fasteign.einflm ?? undefined,
          sizeUnit: fasteign.eining ?? undefined,
          propertyValue: fasteign.fasteignamat,
          propertyLandValue: fasteign.lhlmat,
          appraisalUnits: adalmatseining.map((a) => {
            return {
              propertyNumber: a.fastnum,
              propertyCode: a.fasteignNr,
              propertyValue: a.fasteignamat,
              propertyLandValue: a.lhlmat,
              propertyUsageDescription: a.notkunTexti ?? undefined,
              addressCode: a.stadfangNr,
              address: a.stadfangBirting ?? undefined,
              unitCode: a.merking ?? undefined,
              units: a.matseiningar?.map((m) => {
                return {
                  appraisalUnitCode: m.fnum,
                  propertyValue: m.fasteignamat,
                  propertyCode: m.fastnum,
                  propertyUsageDescription: m.notkunTexti ?? undefined,
                  unitCode: m.merking ?? undefined,
                  addressCode: m.stadfangNr,
                  address: m.stadfangBirting ?? undefined,
                  fireInsuranceValuation: m.brunabotamat,
                  sizeUnit: m.eining ?? undefined,
                  size: m.einflm ?? undefined,
                }
              }),
            }
          }),
        }
      })
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Unknown error'
      throw new Error(
        `Failed to retrieve property information: ${errorMessage}`,
      )
    }
  }
}
