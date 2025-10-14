import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Inject, Injectable } from '@nestjs/common'
import {
  Adalmatseining,
  AdalmatseiningApi,
  ApiAdalmatseiningByFasteignNrGetRequest,
  ApiStadfangSearchGetRequest,
  BaseAPI,
  Fasteign,
  FasteignApi,
  StadfangApi,
} from '../../gen/fetch'
import {
  Fasteign as FasteignAsset,
  FasteignirApi,
} from '@island.is/clients/assets'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class HmsService {
  constructor(
    private readonly stadfangApi: StadfangApi,
    private readonly fasteignApi: FasteignApi,
    private readonly adalmatseiningApi: AdalmatseiningApi,
    private propertiesApi: FasteignirApi,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
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

  async hmsPropertyInfo(
    user: User,
    input: { stadfangNr: number; fasteignNr?: number },
  ) {
    const stadFangNr = input.stadfangNr
    const fasteignNr = input.fasteignNr

    try {
      const fasteignir = await this.apiWithAuth(
        this.fasteignApi,
        user,
      ).apiFasteignByStadfangNrGet({ stadfangNr: stadFangNr })

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

      const transformFasteignir = (fasteign: Fasteign) => {
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
          appraisalUnits: adalmatseining.map((a) => ({
            propertyNumber: a.fastnum,
            propertyCode: a.fasteignNr,
            propertyValue: a.fasteignamat,
            propertyLandValue: a.lhlmat,
            propertyUsageDescription: a.notkunTexti ?? undefined,
            addressCode: a.stadfangNr,
            address: a.stadfangBirting ?? undefined,
            unitCode: a.merking ?? undefined,
            units: a.matseiningar?.map((m) => ({
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
            })),
          })),
        }
      }

      const filteredFasteignir = fasteignNr
        ? fasteignir.filter((f) => f.fasteignNr === fasteignNr)
        : fasteignir

      return filteredFasteignir.map(transformFasteignir)
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Unknown error'
      throw new Error(
        `Failed to retrieve property information: ${errorMessage}`,
      )
    }
  }

  async hmsPropertyCodeInfo(
    user: User,
    input: ApiAdalmatseiningByFasteignNrGetRequest,
  ) {
    try {
      const adalmatseiningar = await this.apiWithAuth(
        this.adalmatseiningApi,
        user,
      ).apiAdalmatseiningByFasteignNrGet({
        fasteignNr: input.fasteignNr,
      })

      if (!adalmatseiningar?.length) {
        throw new Error('No appraisal data found for this property number.')
      }

      const adalmatseining = adalmatseiningar[0]

      if (!adalmatseining.stadfangNr) {
        throw new Error('Missing address code (stadfangNr) in appraisal data.')
      }

      return {
        address: adalmatseining.stadfangBirting ?? undefined,
        addressCode: adalmatseining.stadfangNr,
        landCode: undefined,
        municipalityCode: undefined,
        municipalityName: undefined,
        numOfConnectedProperties: undefined,
        postalCode: undefined,
        propertyCode: input.fasteignNr,
        streetName: undefined,
        streetNumber: undefined,
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Unknown error'
      throw new Error(
        `Failed to retrieve property information: ${errorMessage}`,
      )
    }
  }

  // This is using the relatively new FasteignirApi
  async hmsPropertyByPropertyCode(
    auth: User,
    input: { fasteignNrs?: string[] } = { fasteignNrs: [] },
  ) {
    let properties: Array<FasteignAsset> = []

    try {
      const api = this.propertiesApi.withMiddleware(
        new AuthMiddleware(auth, { forwardUserInfo: true }),
      )

      properties = await Promise.all(
        input.fasteignNrs?.map((nr) => {
          return api.fasteignirGetFasteign({
            fasteignanumer:
              // fasteignirGetFasteignir returns the fasteignanumer with and "F" in front
              // but fasteignirGetFasteign throws an error if the fasteignanumer is not only numbers
              nr?.replace(/\D/g, '') ?? '',
          })
        }) ?? [],
      )
    } catch (e) {
      this.logger.error('Failed to fetch properties:', e)
      const errorMessage =
        e.response?.data?.message || e.message || 'Unknown error'
      throw new Error(`Failed to fetch properties: ${errorMessage}`)
    }

    return properties
  }
}
