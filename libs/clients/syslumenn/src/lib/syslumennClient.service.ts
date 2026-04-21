import { Inject, Injectable } from '@nestjs/common'
import startOfDay from 'date-fns/startOfDay'

import {
  Auth,
  AuthHeaderMiddleware,
  AuthMiddleware,
} from '@island.is/auth-nest-tools'
import { createEnhancedFetch, handle404 } from '@island.is/clients/middlewares'

import {
  Configuration,
  InnsigludSkjol,
  LogradamadurSvar,
  Skilabod,
  SvarSkeyti,
  SyslumennApi,
  VedbandayfirlitRegluverkGeneralSvar,
  VedbondTegundAndlags,
  VirkLeyfiGetRequest,
} from '../../gen/fetch'
import { SyslumennClientConfig } from './syslumennClient.config'
import {
  AlcoholLicence,
  AssetName,
  AssetType,
  Attachment,
  Broker,
  CertificateInfoResponse,
  DataUploadResponse,
  DistrictCommissionerAgencies,
  EstateInfo,
  EstateRegistrant,
  EstateRelations,
  Homestay,
  InheritanceReportInfo,
  InheritanceTax,
  Lawyer,
  ManyPropertyDetail,
  MortgageCertificate,
  MortgageCertificateValidation,
  OperatingLicensesCSV,
  PaginatedOperatingLicenses,
  Person,
  PropertyDetail,
  RealEstateAgent,
  RegistryPerson,
  SyslumennAuction,
  SyslumennDelegationType,
  TemporaryEventLicence,
  VehicleRegistration,
} from './syslumennClient.types'
import {
  cleanPropertyNumber,
  constructUploadDataObject,
  mapAlcoholLicence,
  mapAssetName,
  mapBroker,
  mapBurningPermits,
  mapCertificateInfo,
  mapDataUploadResponse,
  mapDepartedToRegistryPerson,
  mapDistrictCommissionersAgenciesResponse,
  mapDrivingInstructor,
  mapEstateInfo,
  mapEstateRegistrant,
  mapEstateToInheritanceReportInfo,
  mapHomestay,
  mapInheritanceTax,
  mapJourneymanLicence,
  mapLawyer,
  mapMasterLicence,
  mapOperatingLicensesCSV,
  mapPaginatedOperatingLicenses,
  mapProfessionRight,
  mapPropertyCertificate,
  mapRealEstateAgent,
  mapRealEstateResponse,
  mapReligiousOrganization,
  mapShipResponse,
  mapSyslumennAuction,
  mapTemporaryEventLicence,
  mapVehicle,
  mapVehicleResponse,
} from './syslumennClient.utils'
import type { ConfigType } from '@island.is/nest/config'
import { IdsClientConfig } from '@island.is/nest/config'
import { logger } from '@island.is/logging'

const UPLOAD_DATA_SUCCESS = 'Gögn móttekin'
@Injectable()
export class SyslumennService {
  constructor(
    @Inject(SyslumennClientConfig.KEY)
    private clientConfig: ConfigType<typeof SyslumennClientConfig>,

    @Inject(IdsClientConfig.KEY)
    private idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) {}

  private async createApi() {
    const api = new SyslumennApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-syslumenn',
          organizationSlug: 'syslumenn',
          ...this.clientConfig.fetch,
        }),
        basePath: this.clientConfig.url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    )

    const config = {
      notandi: this.clientConfig.username,
      lykilord: this.clientConfig.password,
    }

    const { audkenni, accessToken } = await api.innskraningPost({
      apiNotandi: config,
    })
    if (audkenni && accessToken) {
      return {
        id: audkenni,
        api: api.withMiddleware(
          new AuthHeaderMiddleware(`Bearer ${accessToken}`),
        ),
      }
    } else {
      throw new Error('Syslumenn client configuration and login went wrong')
    }
  }

  private async createApiWithAuth(auth: Auth) {
    const apiWithAuth = new SyslumennApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-syslumenn',
          organizationSlug: 'syslumenn',
          autoAuth: {
            mode: 'tokenExchange',
            issuer: this.idsClientConfig.issuer,
            clientId: this.idsClientConfig.clientId,
            clientSecret: this.idsClientConfig.clientSecret,
            scope: [],
          },
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        basePath: this.clientConfig.url,
      }),
    )

    return {
      api: apiWithAuth.withMiddleware(new AuthMiddleware(auth)),
    }
  }

  async getHomestays(year?: number): Promise<Homestay[]> {
    const { id, api } = await this.createApi()

    const homestays = year
      ? await api.virkarHeimagistingarGet2({
          audkenni: id,
          ar: JSON.stringify(year),
        })
      : await api.virkarHeimagistingarGet({
          audkenni: id,
        })

    return (homestays ?? []).map(mapHomestay)
  }

  async getSyslumennAuctions(): Promise<SyslumennAuction[]> {
    const { id, api } = await this.createApi()
    const syslumennAuctions = await api.uppbodGet({
      audkenni: id,
    })

    return (syslumennAuctions ?? []).map(mapSyslumennAuction)
  }

  async getRealEstateAgents(): Promise<RealEstateAgent[]> {
    const { id, api } = await this.createApi()
    const agents = await api.fasteignasalarGet({
      audkenni: id,
    })
    return (agents ?? []).map(mapRealEstateAgent)
  }

  async getLawyers(): Promise<Lawyer[]> {
    const { id, api } = await this.createApi()
    const lawyers = await api.logmannalistiGet({
      audkenni: id,
    })
    return (lawyers ?? []).map(mapLawyer)
  }

  async getBrokers(): Promise<Broker[]> {
    const { id, api } = await this.createApi()
    const brokers = await api.verdbrefamidlararGet({
      audkenni: id,
    })
    return (brokers ?? []).map(mapBroker)
  }

  async getOperatingLicenses(
    searchQuery?: string,
    pageNumber?: number,
    pageSize?: number,
  ): Promise<PaginatedOperatingLicenses> {
    // Prepare client request
    const { id, api } = await this.createApi()
    const params: VirkLeyfiGetRequest = { audkenni: id }
    if (searchQuery) {
      params.searchBy = searchQuery
    }
    if (pageNumber) {
      params.pageNumber = pageNumber
    }
    if (pageSize) {
      params.pageSize = pageSize
    }

    // Do the client request.
    const virkLeyfiApiResponse = await api.virkLeyfiGetRaw(params)

    // Custom response header for Pagination Info
    const HEADER_KEY_PAGINATION_INFO = 'x-pagination'
    const paginationInfo = virkLeyfiApiResponse.raw.headers.get(
      HEADER_KEY_PAGINATION_INFO,
    )
    if (!paginationInfo) {
      throw new Error(
        'Syslumenn API did not return pagination info for operating licences.',
      )
    }

    // Custom response header for Searcy By
    const HEADER_KEY_SEARCH_BY = 'x-searchby'
    const searchBy = decodeURIComponent(
      virkLeyfiApiResponse.raw.headers.get(HEADER_KEY_SEARCH_BY) ?? '',
    )

    return mapPaginatedOperatingLicenses(
      searchBy,
      paginationInfo,
      await virkLeyfiApiResponse.value(),
    )
  }

  async getOperatingLicensesCSV(): Promise<OperatingLicensesCSV> {
    const { id, api } = await this.createApi()
    const csv = await api
      .withMiddleware({
        pre: async (context) => {
          context.init.headers = Object.assign({}, context.init.headers, {
            Accept: 'text/plain',
            'Content-Type': 'text/plain',
          })
        },
      })
      .virkLeyfiCsvGet({
        audkenni: id,
      })
    return mapOperatingLicensesCSV(csv)
  }

  async getAlcoholLicences(): Promise<AlcoholLicence[]> {
    const { id, api } = await this.createApi()

    const alcoholLicences = await api.afengisleyfiGet({
      audkenni: id,
    })

    return (alcoholLicences ?? []).map(mapAlcoholLicence)
  }

  async getTemporaryEventLicences(): Promise<TemporaryEventLicence[]> {
    const { id, api } = await this.createApi()

    const temporaryEventLicences = await api.taekifaerisleyfiGet({
      audkenni: id,
    })

    return (temporaryEventLicences ?? []).map(mapTemporaryEventLicence)
  }

  async sealDocuments(documents: string[]): Promise<InnsigludSkjol> {
    const { id, api } = await this.createApi()
    const explanation = 'Rafrænt undirritað vottorð'
    return await api.innsiglaSkjolPost({
      innsiglaSkjolSkeyti: {
        audkenni: id,
        skyring: explanation,
        skjol: documents,
      },
    })
  }

  async sealDocument(document: string): Promise<SvarSkeyti> {
    const { id, api } = await this.createApi()
    const explanation = 'Rafrænt undirritað vottorð'
    return await api.innsiglunPost({
      innsiglaSkeyti: {
        audkenni: id,
        skyring: explanation,
        skjal: document,
      },
    })
  }

  async uploadData(
    persons: Person[],
    attachments: Attachment[] | undefined,
    extraData: { [key: string]: string },
    uploadDataName: string,
    uploadDataId?: string,
  ): Promise<DataUploadResponse> {
    const { id, api } = await this.createApi()

    const payload = constructUploadDataObject(
      id,
      persons,
      attachments,
      extraData,
      uploadDataName,
      uploadDataId,
    )

    const response = await api.syslMottakaGognPost(payload).catch((e) => {
      throw new Error(`Syslumenn-client: uploadData failed ${e.type}`)
    })

    const success = response.skilabod === UPLOAD_DATA_SUCCESS
    if (!success) {
      throw new Error(`POST uploadData was not successful`)
    }

    return mapDataUploadResponse(response)
  }

  async uploadDataPreemptiveErrorCheck(
    persons: Person[],
    attachments: Attachment[] | undefined,
    extraData: { [key: string]: string },
    uploadDataName: string,
    uploadDataId?: string,
  ): Promise<Skilabod> {
    const { id, api } = await this.createApi()

    const payload = constructUploadDataObject(
      id,
      persons,
      attachments,
      extraData,
      uploadDataName,
      uploadDataId,
    )

    return api.syslMottakaVilluprofaGognPost(payload)
  }

  async getCertificateInfo(
    nationalId: string,
  ): Promise<CertificateInfoResponse | null> {
    const { id, api } = await this.createApi()
    const certificate = await api
      .faVottordUpplysingarGet({
        audkenni: id,
        kennitala: nationalId,
      })
      .catch((e) => {
        if ((e as { status: number })?.status === 404) {
          return null
        }

        throw e
      })

    if (!certificate) {
      return null
    }
    return mapCertificateInfo(certificate)
  }

  async getDistrictCommissionersAgencies(): Promise<
    DistrictCommissionerAgencies[]
  > {
    const { api } = await this.createApi()
    const response = await api.embaettiOgStarfsstodvarGetEmbaetti()
    return response.map(mapDistrictCommissionersAgenciesResponse)
  }

  async getAsset(
    assetId: string,
    assetType: AssetType,
    assetMapper: (res: VedbandayfirlitRegluverkGeneralSvar) => AssetName,
  ): Promise<Array<AssetName>> {
    const { id, api } = await this.createApi()
    const response = await api
      .vedbokavottordRegluverkiPost({
        vedbandayfirlitSkeyti: {
          audkenni: id,
          fastanumer: cleanPropertyNumber(assetId),
          tegundAndlags: assetType as unknown as VedbondTegundAndlags,
        },
      })
      .catch((e) => {
        if ((e as { status: number })?.status === 404) {
          return null
        }
        throw e
      })

    return response ? [assetMapper(response)] : []
  }

  async getRealEstateAddress(realEstateId: string): Promise<Array<AssetName>> {
    return await this.getAsset(
      realEstateId.toUpperCase(),
      AssetType.RealEstate,
      mapAssetName,
    )
  }

  async getVehicleType(vehicleId: string): Promise<Array<AssetName>> {
    return await this.getAsset(vehicleId, AssetType.Vehicle, mapAssetName)
  }

  async getVehicle(vehicleId: string): Promise<VehicleRegistration> {
    const { id, api } = await this.createApi()
    const response = await api.okutaekiGet({
      audkenni: id,
      fastanumer: vehicleId,
    })
    return mapVehicle(response)
  }

  async getMortgageCertificate(
    properties: {
      propertyNumber: string
      propertyType: string
    }[],
  ): Promise<MortgageCertificate[]> {
    const { id, api } = await this.createApi()

    const res = await api.vedbokarvottord2Post({
      vedbandayfirlitMargirSkeyti: {
        audkenni: id,
        eignir: properties.map(({ propertyNumber, propertyType }) => {
          return {
            fastanumer: propertyNumber,
            tegundAndlags:
              propertyType === '1'
                ? VedbondTegundAndlags.NUMBER_1 // 1 = Vehicle
                : propertyType === '2'
                ? VedbondTegundAndlags.NUMBER_2 // 2 = Ship
                : VedbondTegundAndlags.NUMBER_0, // 0 = Real estate
          }
        }),
      },
    })

    const certificates: MortgageCertificate[] =
      res.skilabodOgSkra?.map((resultItem) => {
        const contentBase64 = resultItem.vedbandayfirlitPDFSkra || ''
        return {
          contentBase64: contentBase64,
          apiMessage: resultItem.skilabod ?? undefined,
          propertyNumber: resultItem.fastanumer ?? undefined,
        }
      }) ?? []

    return certificates
  }

  async validateMortgageCertificate(
    properties: {
      propertyNumber: string
      propertyType: string
    }[],
  ): Promise<MortgageCertificateValidation[]> {
    try {
      // Note: this function will throw an error if something goes wrong
      const certificates = await this.getMortgageCertificate(properties)

      // Note: we are saving propertyNumber and isFromSearch also in externalData,
      // since it is not saved in answers if we go from state DRAFT -> DRAFT
      return certificates.map(mapPropertyCertificate)
    } catch (exception) {
      throw new Error(
        `Validation failed for properties: ${JSON.stringify(properties)}`,
      )
    }
  }

  async getPropertyDetails(propertyNumber: string): Promise<PropertyDetail> {
    const { id, api } = await this.createApi()

    const res = await api
      .vedbokavottordRegluverkiPost({
        vedbandayfirlitSkeyti: {
          audkenni: id,
          fastanumer: cleanPropertyNumber(propertyNumber),
          tegundAndlags: VedbondTegundAndlags.NUMBER_0, // 0 = Real estate
        },
      })
      .catch(() => {
        throw new Error(
          `Failed to get propertyDetail for property number: ${propertyNumber}`,
        )
      })

    const fasteign = res.fasteign?.length ? res.fasteign[0] : undefined

    return {
      propertyNumber: propertyNumber,
      defaultAddress: {
        display: fasteign?.heiti || '',
      },
      unitsOfUse: {
        unitsOfUse: [
          {
            explanation: fasteign?.notkun ?? undefined,
          },
        ],
      },
    }
  }

  async getAllPropertyDetails(
    propertyNumber: string,
    propertyType: string,
  ): Promise<ManyPropertyDetail> {
    const { id, api } = await this.createApi()

    const res = await api
      .vedbokavottordRegluverkiPost({
        vedbandayfirlitSkeyti: {
          audkenni: id,
          fastanumer:
            propertyType === '0'
              ? cleanPropertyNumber(propertyNumber)
              : propertyNumber,
          tegundAndlags:
            propertyType === '1'
              ? VedbondTegundAndlags.NUMBER_1 // 1 = Vehicle
              : propertyType === '2'
              ? VedbondTegundAndlags.NUMBER_2 // 2 = Ship
              : VedbondTegundAndlags.NUMBER_0, // 0 = Real estate
        },
      })
      .catch(handle404)

    return {
      propertyNumber: res?.fastanum ?? undefined,
      propertyType: res?.tegundEignar ?? undefined,
      realEstate: res?.fasteign ? res.fasteign.map(mapRealEstateResponse) : [],
      vehicle: res?.okutaeki ? mapVehicleResponse(res.okutaeki) : undefined,
      ship: res?.skip ? mapShipResponse(res.skip) : undefined,
    }
  }

  async getEstateRegistrant(
    registrantNationalId: string,
  ): Promise<Array<EstateRegistrant>> {
    const { id, api } = await this.createApi()

    const res = await api.skraningaradiliDanarbusGet({
      audkenni: id,
      kennitala: registrantNationalId,
    })

    if (res.length > 0) {
      return res.map(mapEstateRegistrant)
    }
    return []
  }

  async getEstateRelations(): Promise<EstateRelations> {
    const { id, api } = await this.createApi()
    const res = await api.danarbuAlgengTengslGet({
      audkenni: id,
    })
    return {
      relations: res
        .map((relation) => relation?.heiti)
        .filter((heiti): heiti is string => Boolean(heiti)),
    }
  }

  async getRegistryPerson(nationalId: string): Promise<RegistryPerson> {
    const { id, api } = await this.createApi()
    const res = await api.leitaAdKennitoluIThjodskraPost({
      thjodskraSkeyti: {
        audkenni: id,
        kennitala: nationalId,
      },
    })

    return mapDepartedToRegistryPerson(res)
  }

  async getInheritanceTax(caseNumber: string): Promise<InheritanceTax> {
    const { id, api } = await this.createApi()
    const res = await api.erfdafjarskatturGet({
      audkenni: id,
      malsnumer: caseNumber,
    })

    return mapInheritanceTax(res)
  }

  async getEstateInfoForInheritanceReport(
    nationalId: string,
  ): Promise<Array<InheritanceReportInfo>> {
    const { id, api } = await this.createApi()
    const res = await api.upplysingarUrDanarbuiErfdafjarskattPost({
      fyrirspurn: {
        audkenni: id,
        kennitala: nationalId,
      },
    })

    const { yfirlit: overView } = res
    return (overView ?? []).map(mapEstateToInheritanceReportInfo)
  }

  async changeEstateRegistrant(
    currentRegistrantNationalId: string,
    newRegistrantNationalId: string,
    caseNumber: string,
  ): Promise<unknown> {
    const { id, api } = await this.createApi()
    const res = await api.skiptaUmSkraningaradilaDanarbusPost({
      skiptaUmSkraningaradili: {
        audkenni: id,
        kennitalaFra: currentRegistrantNationalId,
        kennitalaTil: newRegistrantNationalId,
        malsnumer: caseNumber,
      },
    })
    return res
  }

  async getEstateInfo(nationalId: string): Promise<EstateInfo[]> {
    const { id, api } = await this.createApi()
    const res = await api.upplysingarUrDanarbuiPost({
      fyrirspurn: {
        audkenni: id,
        kennitala: nationalId,
      },
    })
    return res.yfirlit?.map(mapEstateInfo) ?? []
  }

  async getEstateInfoWithAvailableSettlements(
    nationalId: string,
  ): Promise<EstateInfo[]> {
    const { id, api } = await this.createApi()
    const res = await api.upplysingarRadstofunDanarbusPost({
      fyrirspurn: {
        audkenni: id,
        kennitala: nationalId,
      },
    })

    return res?.yfirlit?.map(mapEstateInfo) ?? []
  }

  async getMasterLicences() {
    const { id, api } = await this.createApi()
    const res = await api.meistaraleyfiGet({
      audkenni: id,
    })
    return res
      .map(mapMasterLicence)
      .filter((licence) => Boolean(licence.name) && Boolean(licence.profession))
  }

  async getJourneymanLicences() {
    const { id, api } = await this.createApi()
    const res = await api.sveinsbrefGet({
      audkenni: id,
    })
    return res
      .map(mapJourneymanLicence)
      .filter((licence) => Boolean(licence.name) && Boolean(licence.profession))
  }

  async getProfessionRights() {
    const { id, api } = await this.createApi()
    const res = await api.starfsrettindiGet({
      audkenni: id,
    })
    return res
      .map(mapProfessionRight)
      .filter(
        (professionRight) =>
          Boolean(professionRight.name) && Boolean(professionRight.profession),
      )
  }

  async checkCriminalRecord(auth: Auth) {
    const { api } = await this.createApiWithAuth(auth)
    // Note: District Commissioners (Sýslumenn) have requested that we include the
    //       authorization token from island.is in the request in the following header
    //       'islandis-token'. This is to comply with Sýslumenn's exposed usage of
    //       DMR's endpoint on their system, that is to say, DC forwards this token
    //       to DMR.
    return await api
      .withMiddleware({
        pre: async (context) => {
          context.init.headers = Object.assign({}, context.init.headers, {
            'islandis-token': auth.authorization,
          })
        },
      })
      .kannaSakavottordAuthGet()
  }

  async uploadDataCriminalRecord(
    auth: Auth,
    persons: Person[],
    attachments: Attachment[] | undefined,
    extraData: { [key: string]: string },
    uploadDataName: string,
    uploadDataId?: string,
  ): Promise<DataUploadResponse> {
    logger.info('AfgreidaSakavottord Starting uploadProcess')
    const { api } = await this.createApiWithAuth(auth)

    const payload = constructUploadDataObject(
      '',
      persons,
      attachments,
      extraData,
      uploadDataName,
      uploadDataId,
    )

    const response = await api.afgreidaSakavottordPost(payload).catch((e) => {
      throw new Error(`Syslumenn-client: AfgreidaSakavottord failed ${e.type}`)
    })

    const success = response.skilabod === UPLOAD_DATA_SUCCESS
    if (!success) {
      throw new Error(
        `POST AfgreidaSakavottord was not successful, response.skilabod: ${response.skilabod}`,
      )
    }

    return mapDataUploadResponse(response)
  }

  async checkIfDelegationExists(
    toNationalId: string,
    fromNationalId: string,
    delegationType: SyslumennDelegationType,
  ): Promise<boolean> {
    const { id, api } = await this.createApi()
    const delegations = await api.virkUmbodGet({
      audkenni: id,
      kennitala: toNationalId,
      tegundUmbods: delegationType,
    })

    return delegations.some(
      (delegation) =>
        delegation.kennitala === fromNationalId &&
        (!delegation.gildirTil ||
          delegation.gildirTil > startOfDay(new Date())),
    )
  }

  /**
   * Check if a person has valid electronic ID credentials.
   *
   * Uses the comprehensive Syslumenn endpoint (kannaRafraenSkilrikiGet2) which checks
   * ALL electronic ID authentication methods, not just phone-based (eSIM).
   *
   * This ensures users with:
   * - Auðkenni app (without SIM card registration) ✓
   * - eSIM/phone-based authentication ✓
   * - Physical smart card authentication ✓
   *
   * ...are all correctly identified as having valid electronic credentials.
   *
   * @param nationalId - Icelandic national ID (kennitala)
   * @returns true if ANY valid electronic ID method exists
   */
  async hasElectronicID(nationalId: string): Promise<boolean> {
    const { id, api } = await this.createApi()
    const res = await api.kannaRafraenSkilrikiGet2({
      audkenni: id,
      kennitala: nationalId,
    })

    // Accept if ANY valid electronic ID method exists
    return (
      res?.gildSkilriki?.simi ||
      res?.gildSkilriki?.app ||
      res?.gildSkilriki?.kort ||
      false
    )
  }

  async checkIfBirthCertificateExists(nationalId: string): Promise<boolean> {
    const { id, api } = await this.createApi()
    const res = await api.kannaKonnunarvottordGet({
      audkenni: id,
      kennitala: nationalId,
    })

    return res.stada ?? false
  }

  async getBurningPermits() {
    const { id, api } = await this.createApi()
    const res = await api.brennuleyfiGet({
      audkenni: id,
    })
    return res.map(mapBurningPermits)
  }

  async getReligiousOrganizations() {
    const { id, api } = await this.createApi()
    const res = await api.trufelogOgLifsskodunarfelogGet({
      audkenni: id,
    })
    const items = res.map(mapReligiousOrganization)
    return items.filter((item) => Boolean(item?.name))
  }

  async getDrivingInstructors() {
    const { id, api } = await this.createApi()
    const res = await api.okukennaraleyfiGet({
      audkenni: id,
    })
    return res
      .map(mapDrivingInstructor)
      .filter((instructor) => Boolean(instructor.name))
  }
}
