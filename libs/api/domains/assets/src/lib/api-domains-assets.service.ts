import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { FetchError } from '@island.is/clients/middlewares'
import { Fasteign, FasteignirApi } from '@island.is/clients/assets'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { PropertyDetail } from '../models/propertyDetail.model'

const getAssetString = (str: string) =>
  str.charAt(0).toLowerCase() === 'f' ? str.substring(1) : str

function mapSingleRealEstate(realEstate: Fasteign) {
  return {
    propertyNumber: realEstate.fasteignanumer ?? undefined,
    defaultAddress: {
      displayShort: realEstate.sjalfgefidStadfang?.birtingStutt ?? undefined,
      display: realEstate.sjalfgefidStadfang?.birting ?? undefined,
      propertyNumber:
        realEstate.sjalfgefidStadfang?.landeignarnumer ?? undefined,
      municipality:
        realEstate.sjalfgefidStadfang?.sveitarfelagBirting ?? undefined,
      postNumber: realEstate.sjalfgefidStadfang?.postnumer ?? undefined,
      locationNumber:
        realEstate.sjalfgefidStadfang?.stadfanganumer ?? undefined,
    },
    appraisal: {
      activeAppraisal:
        realEstate?.fasteignamat?.gildandiFasteignamat ?? undefined,
      plannedAppraisal:
        realEstate?.fasteignamat?.fyrirhugadFasteignamat ?? undefined,
      activeStructureAppraisal:
        realEstate?.fasteignamat?.gildandiMannvirkjamat ?? undefined,
      plannedStructureAppraisal:
        realEstate?.fasteignamat?.fyrirhugadFasteignamat ?? undefined,
      activePlotAssessment:
        realEstate?.fasteignamat?.gildandiLodarhlutamat ?? undefined,
      plannedPlotAssessment:
        realEstate?.fasteignamat?.fyrirhugadLodarhlutamat ?? undefined,
      activeYear: realEstate?.fasteignamat?.gildandiAr ?? undefined,
      plannedYear: realEstate?.fasteignamat?.fyrirhugadAr ?? undefined,
    },
    registeredOwners: {
      paging: realEstate.thinglystirEigendur?.paging ?? undefined,
      registeredOwners: realEstate.thinglystirEigendur?.thinglystirEigendur?.map(
        (owner) => ({
          name: owner.nafn ?? undefined,
          ssn: owner.kennitala ?? undefined,
          ownership: owner.eignarhlutfall ?? undefined,
          purchaseDate: owner.kaupdagur ?? undefined,
          grantDisplay: owner.heimildBirting ?? undefined,
        }),
      ),
    },
    unitsOfUse: {
      paging: realEstate.notkunareiningar?.paging ?? undefined,
      unitsOfUse: realEstate.notkunareiningar?.notkunareiningar?.map(
        (unit) => ({
          propertyNumber: unit.fasteignanumer ?? undefined,
          unitOfUseNumber: unit.notkunareininganumer ?? undefined,
          address: {
            // This does not come from the service as the service is set up today. Needs to come from parent as things stand.
            displayShort:
              realEstate.sjalfgefidStadfang?.birtingStutt ?? undefined,
            display: realEstate.sjalfgefidStadfang?.birting ?? undefined,
            propertyNumber:
              realEstate.sjalfgefidStadfang?.landeignarnumer ?? undefined,
            municipality:
              realEstate.sjalfgefidStadfang?.sveitarfelagBirting ?? undefined,
            postNumber: realEstate.sjalfgefidStadfang?.postnumer ?? undefined,
            locationNumber:
              realEstate.sjalfgefidStadfang?.stadfanganumer ?? undefined,
          },
          marking: unit.merking ?? undefined,
          usageDisplay: unit.notkunBirting ?? undefined,
          displaySize: unit.birtStaerd ?? undefined,
          buildYearDisplay: unit.byggingararBirting ?? undefined,
          fireAssessment: unit.brunabotamat ?? undefined,
          explanation: unit.skyring ?? undefined,
          appraisal: {
            activeAppraisal:
              unit.fasteignamat?.gildandiFasteignamat ?? undefined,
            plannedAppraisal:
              unit.fasteignamat?.fyrirhugadFasteignamat ?? undefined,
            activeStructureAppraisal:
              unit.fasteignamat?.gildandiMannvirkjamat ?? undefined,
            plannedStructureAppraisal:
              unit.fasteignamat?.fyrirhugadFasteignamat ?? undefined,
            activePlotAssessment:
              unit.fasteignamat?.gildandiLodarhlutamat ?? undefined,
            plannedPlotAssessment:
              unit.fasteignamat?.fyrirhugadLodarhlutamat ?? undefined,
            activeYear: unit.fasteignamat?.gildandiAr ?? undefined,
            plannedYear: unit.fasteignamat?.fyrirhugadAr ?? undefined,
          },
        }),
      ),
    },
    land: {
      landNumber: realEstate.landeign?.landeignarnumer ?? undefined,
      landAppraisal: realEstate.landeign?.lodamat ?? undefined,
      useDisplay: realEstate.landeign?.notkunBirting ?? undefined,
      area: realEstate.landeign?.flatarmal ?? undefined,
      areaUnit: realEstate.landeign?.flatarmalEining ?? undefined,
      registeredOwners: {
        paging: realEstate.landeign?.thinglystirEigendur?.paging ?? undefined,
        registeredOwners: realEstate.landeign?.thinglystirEigendur?.thinglystirEigendur?.map(
          (owner) => ({
            name: owner.nafn ?? undefined,
            ssn: owner.kennitala ?? undefined,
            ownership: owner.eignarhlutfall ?? undefined,
            purchaseDate: owner.kaupdagur ?? undefined,
            grantDisplay: owner.heimildBirting ?? undefined,
          }),
        ),
      },
    },
  }
}

@Injectable()
export class AssetsXRoadService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private fasteignirApi: FasteignirApi,
  ) {}

  handleError(error: any): any {
    this.logger.error(error)

    throw new ApolloError(
      'Failed to resolve request',
      error?.message ?? error?.response?.message,
    )
  }

  private handle4xx(error: FetchError) {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    this.handleError(error)
  }

  private getRealEstatesWithAuth(auth: Auth) {
    return this.fasteignirApi.withMiddleware(
      new AuthMiddleware(auth, { forwardUserInfo: true }),
    )
  }

  async getRealEstates(
    auth: User,
    cursor?: string | null,
  ): Promise<any | null> {
    try {
      const fasteignirResponse = await this.getRealEstatesWithAuth(
        auth,
      ).fasteignirGetFasteignir({
        kennitala: auth.nationalId,
        cursor: cursor,
      })

      if (fasteignirResponse) {
        return {
          paging: fasteignirResponse.paging,
          properties: fasteignirResponse.fasteignir?.map((item) => ({
            propertyNumber: item.fasteignanumer,
            defaultAddress: {
              displayShort: item.sjalfgefidStadfang?.birtingStutt,
              display: item.sjalfgefidStadfang?.birting,
              propertyNumber: item.sjalfgefidStadfang?.landeignarnumer,
              municipality: item.sjalfgefidStadfang?.sveitarfelagBirting,
              postNumber: item.sjalfgefidStadfang?.postnumer,
              locationNumber: item.sjalfgefidStadfang?.stadfanganumer,
            },
          })),
        }
      }
      return null
    } catch (e) {
      this.handle4xx(e)
    }
  }

  async getRealEstateDetail(
    assetId: string,
    auth: User,
  ): Promise<PropertyDetail | null> {
    const singleFasteignResponse = await this.getRealEstatesWithAuth(auth)
      .fasteignirGetFasteign({ fasteignanumer: getAssetString(assetId) })
      .catch((e) => this.handle4xx(e))

    if (!singleFasteignResponse) return null
    return mapSingleRealEstate(singleFasteignResponse)
  }

  async getPropertyOwners(
    assetId: string,
    auth: User,
    cursor?: string | null,
    limit?: number | null,
  ): Promise<any | null> {
    try {
      const singleFasteignResponse = await this.getRealEstatesWithAuth(
        auth,
      ).fasteignirGetFasteignEigendur({
        fasteignanumer: getAssetString(assetId),
        cursor: cursor,
        limit: limit,
      })

      if (singleFasteignResponse) {
        return {
          paging: singleFasteignResponse.paging,
          registeredOwners: singleFasteignResponse.thinglystirEigendur?.map(
            (owner) => ({
              name: owner.nafn,
              ssn: owner.kennitala,
              ownership: owner.eignarhlutfall,
              purchaseDate: owner.kaupdagur,
              grantDisplay: owner.heimildBirting,
            }),
          ),
        }
      }
      return null
    } catch (e) {
      this.handle4xx(e)
    }
  }

  async getUnitsOfUse(
    assetId: string,
    auth: User,
    cursor?: string | null,
    limit?: number | null,
  ): Promise<any | null> {
    try {
      const unitsOfUseResponse = await this.getRealEstatesWithAuth(
        auth,
      ).fasteignirGetFasteignNotkunareiningar({
        fasteignanumer: getAssetString(assetId),
        cursor: cursor,
        limit: limit,
      })

      if (unitsOfUseResponse) {
        return {
          paging: unitsOfUseResponse.paging,
          unitsOfUse: unitsOfUseResponse.notkunareiningar?.map((unit) => ({
            propertyNumber: unit.fasteignanumer,
            unitOfUseNumber: unit.notkunareininganumer,
            address: {
              displayShort: unit.stadfang?.birtingStutt,
              display: unit.stadfang?.birting,
              propertyNumber: unit.stadfang?.landeignarnumer,
              municipality: unit.stadfang?.sveitarfelagBirting,
              postNumber: unit.stadfang?.postnumer,
              locationNumber: unit.stadfang?.stadfanganumer,
            },
            marking: unit.merking,
            usageDisplay: unit.notkunBirting,
            displaySize: unit.birtStaerd,
            buildYearDisplay: unit.byggingararBirting,
            fireAssessment: unit.brunabotamat,
            explanation: unit.skyring,
            appraisal: {
              activeAppraisal: unit.fasteignamat?.gildandiFasteignamat,
              plannedAppraisal: unit.fasteignamat?.fyrirhugadFasteignamat,
              activeStructureAppraisal:
                unit.fasteignamat?.gildandiMannvirkjamat,
              plannedStructureAppraisal:
                unit.fasteignamat?.fyrirhugadFasteignamat,
              activePlotAssessment: unit.fasteignamat?.gildandiLodarhlutamat,
              plannedPlotAssessment: unit.fasteignamat?.fyrirhugadLodarhlutamat,
              activeYear: unit.fasteignamat?.gildandiAr,
              plannedYear: unit.fasteignamat?.fyrirhugadAr,
            },
          })),
        }
      }
      return null
    } catch (e) {
      this.handleError(e)
    }
  }

  async getRealEstatesWithDetail(
    auth: User,
    cursor?: string | null,
  ): Promise<any | null> {
    try {
      const getRealEstatesRes = await this.getRealEstates(auth, cursor)

      if (getRealEstatesRes && getRealEstatesRes.properties) {
        return {
          paging: getRealEstatesRes.paging,
          properties: await Promise.all(
            getRealEstatesRes.properties.map(
              (item: { propertyNumber: string }) =>
                this.getRealEstateDetail(item.propertyNumber, auth),
            ),
          ),
        }
      }
      return null
    } catch (e) {
      this.handle4xx(e)
    }
  }
}
