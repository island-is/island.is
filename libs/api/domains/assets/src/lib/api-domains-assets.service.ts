import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { FasteignirApi } from '@island.is/clients/assets'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  PropertiesDTO,
  PropertySingleDTO,
  RegisteredOwnerWrapper,
  UnitsOfUseWrapper,
  AssetsMultiDetail,
} from '../types'

const LOG_CATEGORY = 'assets-service'

const getAssetString = (str: string) =>
  str.charAt(0).toLowerCase() === 'f' ? str.substring(1) : str

@Injectable()
export class AssetsXRoadService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private fasteignirApi: FasteignirApi,
  ) {}

  handleError(error: any, detail?: string): ApolloError | null {
    this.logger.error(detail || 'Domain assets error', {
      error: JSON.stringify(error),
      category: LOG_CATEGORY,
    })
    throw new ApolloError('Failed to resolve request', error.status)
  }

  private handle4xx(error: any, detail?: string): ApolloError | null {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    return this.handleError(error, detail)
  }

  private getRealEstatesWithAuth(auth: User) {
    return this.fasteignirApi.withMiddleware(
      new AuthMiddleware(auth, { forwardUserInfo: true }),
    )
  }

  async getRealEstates(
    auth: User,
    cursor?: string | null,
  ): Promise<PropertiesDTO | null> {
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
      this.handle4xx(e, 'Failed to get assets list')
      return null
    }
  }

  async getRealEstateDetail(
    assetId: string,
    auth: User,
  ): Promise<PropertySingleDTO | null> {
    try {
      const singleFasteignResponse = await this.getRealEstatesWithAuth(
        auth,
      ).fasteignirGetFasteign({
        fasteignanumer: getAssetString(assetId),
      })

      if (singleFasteignResponse) {
        return {
          propertyNumber: singleFasteignResponse.fasteignanumer,
          defaultAddress: {
            displayShort:
              singleFasteignResponse.sjalfgefidStadfang?.birtingStutt,
            display: singleFasteignResponse.sjalfgefidStadfang?.birting,
            propertyNumber:
              singleFasteignResponse.sjalfgefidStadfang?.landeignarnumer,
            municipality:
              singleFasteignResponse.sjalfgefidStadfang?.sveitarfelagBirting,
            postNumber: singleFasteignResponse.sjalfgefidStadfang?.postnumer,
            locationNumber:
              singleFasteignResponse.sjalfgefidStadfang?.stadfanganumer,
          },
          appraisal: {
            activeAppraisal:
              singleFasteignResponse?.fasteignamat?.gildandiFasteignamat,
            plannedAppraisal:
              singleFasteignResponse?.fasteignamat?.fyrirhugadFasteignamat,
            activeStructureAppraisal:
              singleFasteignResponse?.fasteignamat?.gildandiMannvirkjamat,
            plannedStructureAppraisal:
              singleFasteignResponse?.fasteignamat?.fyrirhugadMannvirkjamat,
            activePlotAssessment:
              singleFasteignResponse?.fasteignamat?.gildandiLodarhlutamat,
            plannedPlotAssessment:
              singleFasteignResponse?.fasteignamat?.fyrirhugadLodarhlutamat,
            activeYear: singleFasteignResponse?.fasteignamat?.gildandiAr,
            plannedYear: singleFasteignResponse?.fasteignamat?.fyrirhugadAr,
          },
          registeredOwners: {
            paging: singleFasteignResponse.thinglystirEigendur?.paging,
            registeredOwners:
              singleFasteignResponse.thinglystirEigendur?.thinglystirEigendur?.map(
                (owner) => ({
                  name: owner.nafn,
                  ssn: owner.kennitala,
                  ownership: owner.eignarhlutfall,
                  purchaseDate: owner.kaupdagur,
                  grantDisplay: owner.heimildBirting,
                }),
              ),
          },
          unitsOfUse: {
            paging: singleFasteignResponse.notkunareiningar?.paging,
            unitsOfUse:
              singleFasteignResponse.notkunareiningar?.notkunareiningar?.map(
                (unit) => ({
                  propertyNumber: unit.fasteignanumer,
                  unitOfUseNumber: unit.notkunareininganumer,
                  address: {
                    // This does not come from the service as the service is set up today. Needs to come from parent as things stand.
                    displayShort:
                      singleFasteignResponse.sjalfgefidStadfang?.birtingStutt,
                    display: singleFasteignResponse.sjalfgefidStadfang?.birting,
                    propertyNumber:
                      singleFasteignResponse.sjalfgefidStadfang
                        ?.landeignarnumer,
                    municipality:
                      singleFasteignResponse.sjalfgefidStadfang
                        ?.sveitarfelagBirting,
                    postNumber:
                      singleFasteignResponse.sjalfgefidStadfang?.postnumer,
                    locationNumber:
                      singleFasteignResponse.sjalfgefidStadfang?.stadfanganumer,
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
                    activePlotAssessment:
                      unit.fasteignamat?.gildandiLodarhlutamat,
                    plannedPlotAssessment:
                      unit.fasteignamat?.fyrirhugadLodarhlutamat,
                    activeYear: unit.fasteignamat?.gildandiAr,
                    plannedYear: unit.fasteignamat?.fyrirhugadAr,
                  },
                }),
              ),
          },
          land: {
            landNumber: singleFasteignResponse.landeign?.landeignarnumer,
            landAppraisal: singleFasteignResponse.landeign?.lodamat,
            useDisplay: singleFasteignResponse.landeign?.notkunBirting,
            area: singleFasteignResponse.landeign?.flatarmal,
            areaUnit: singleFasteignResponse.landeign?.flatarmalEining,
            registeredOwners: {
              paging:
                singleFasteignResponse.landeign?.thinglystirEigendur?.paging,
              registeredOwners:
                singleFasteignResponse.landeign?.thinglystirEigendur?.thinglystirEigendur?.map(
                  (owner) => ({
                    name: owner.nafn,
                    ssn: owner.kennitala,
                    ownership: owner.eignarhlutfall,
                    purchaseDate: owner.kaupdagur,
                    grantDisplay: owner.heimildBirting,
                  }),
                ),
            },
          },
        }
      }
      return null
    } catch (e) {
      this.handle4xx(e, 'Failed to get detail asset')
      return null
    }
  }

  async getPropertyOwners(
    assetId: string,
    auth: User,
    cursor?: string | null,
    limit?: number | null,
  ): Promise<RegisteredOwnerWrapper | null> {
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
      this.handle4xx(e, 'Failed to get assets owner')
      return null
    }
  }

  async getUnitsOfUse(
    assetId: string,
    auth: User,
    cursor?: string | null,
    limit?: number | null,
  ): Promise<UnitsOfUseWrapper | null> {
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
      this.handle4xx(e, 'Failed to get units of use for asset')
      return null
    }
  }

  async getRealEstatesWithDetail(
    auth: User,
    cursor?: string | null,
  ): Promise<AssetsMultiDetail | null> {
    try {
      const getRealEstatesRes = await this.getRealEstates(auth, cursor)

      if (getRealEstatesRes && getRealEstatesRes.properties) {
        return {
          paging: getRealEstatesRes.paging,
          properties: await Promise.all(
            getRealEstatesRes.properties.map((item) =>
              this.getRealEstateDetail(item.propertyNumber ?? '', auth),
            ),
          ),
        }
      }
      return null
    } catch (e) {
      this.handle4xx(e, 'Failed to get assets with detail')
      return null
    }
  }
}
