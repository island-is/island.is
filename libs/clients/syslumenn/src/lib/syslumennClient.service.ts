import {
  AlcoholLicence,
  SyslumennAuction,
  Homestay,
  PaginatedOperatingLicenses,
  OperatingLicensesCSV,
  CertificateInfoResponse,
  DistrictCommissionerAgencies,
  DataUploadResponse,
  Person,
  Attachment,
  AssetType,
  MortgageCertificate,
  MortgageCertificateValidation,
  AssetName,
  EstateRegistrant,
  EstateRelations,
  EstateInfo,
  RealEstateAgent,
  Lawyer,
  Broker,
  PropertyDetail,
  TemporaryEventLicence,
  VehicleRegistration,
  RegistryPerson,
  InheritanceTax,
  InheritanceReportInfo,
  ManyPropertyDetail,
} from './syslumennClient.types'
import {
  mapSyslumennAuction,
  mapHomestay,
  mapPaginatedOperatingLicenses,
  mapOperatingLicensesCSV,
  mapCertificateInfo,
  mapDistrictCommissionersAgenciesResponse,
  mapDataUploadResponse,
  constructUploadDataObject,
  mapAssetName,
  mapEstateRegistrant,
  mapEstateInfo,
  mapRealEstateAgent,
  mapLawyer,
  mapBroker,
  mapAlcoholLicence,
  cleanPropertyNumber,
  mapTemporaryEventLicence,
  mapMasterLicence,
  mapVehicle,
  mapDepartedToRegistryPerson,
  mapInheritanceTax,
  mapEstateToInheritanceReportInfo,
  mapJourneymanLicence,
  mapProfessionRight,
  mapVehicleResponse,
  mapRealEstateResponse,
  mapShipResponse,
} from './syslumennClient.utils'
import { Injectable, Inject } from '@nestjs/common'
import {
  SyslumennApi,
  SvarSkeyti,
  Configuration,
  VirkLeyfiGetRequest,
  VedbondTegundAndlags,
  Skilabod,
  VedbandayfirlitRegluverkGeneralSvar,
} from '../../gen/fetch'
import { SyslumennClientConfig } from './syslumennClient.config'
import type { ConfigType } from '@island.is/nest/config'
import { AuthHeaderMiddleware } from '@island.is/auth-nest-tools'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

const UPLOAD_DATA_SUCCESS = 'Gögn móttekin'

@Injectable()
export class SyslumennService {
  constructor(
    @Inject(SyslumennClientConfig.KEY)
    private clientConfig: ConfigType<typeof SyslumennClientConfig>,
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
      notandi: config,
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

  async sealDocument(document: string): Promise<SvarSkeyti> {
    const { id, api } = await this.createApi()
    const explination = 'Rafrænt undirritað vottorð'
    return await api.innsiglunPost({
      skeyti: {
        audkenni: id,
        skyring: explination,
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
        skilabod: {
          audkenni: id,
          fastanumer: cleanPropertyNumber(assetId),
          tegundAndlags: assetType as number,
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

  async getMortgageCertificateOld(
    propertyNumber: string,
  ): Promise<MortgageCertificate> {
    const { id, api } = await this.createApi()

    const res = await api.vedbokarvottordPost({
      skilabod: {
        audkenni: id,
        fastanumer: cleanPropertyNumber(propertyNumber),
        tegundAndlags: VedbondTegundAndlags.NUMBER_0, // 0 = Real estate
      },
    })
    const contentBase64 = res.vedbandayfirlitPDFSkra || ''

    const certificate: MortgageCertificate = {
      contentBase64: contentBase64,
      apiMessage: res.skilabod,
    }

    return certificate
  }

  async validateMortgageCertificateOld(
    propertyNumber: string,
    isFromSearch: boolean | undefined,
  ): Promise<MortgageCertificateValidation> {
    try {
      // Note: this function will throw an error if something goes wrong
      const certificate = await this.getMortgageCertificateOld(propertyNumber)

      const exists = certificate.contentBase64.length !== 0
      const hasKMarking =
        exists && certificate.contentBase64 !== 'Precondition Required'

      // Note: we are saving propertyNumber and isFromSearch also in externalData,
      // since it is not saved in answers if we go from state DRAFT -> DRAFT
      return {
        propertyNumber: propertyNumber,
        exists: exists,
        hasKMarking: hasKMarking,
      }
    } catch (exception) {
      return {
        propertyNumber: propertyNumber,
        exists: false,
        hasKMarking: false,
      }
    }
  }

  async getMortgageCertificate(
    properties: {
      propertyNumber: string
      propertyType: string
    }[],
  ): Promise<MortgageCertificate[]> {
    const { id, api } = await this.createApi()

    properties.map(({ propertyNumber, propertyType }) => {
      console.log('STUFF', propertyNumber)
      console.log('AND THINGS', propertyType)
    })

    const res = await api.vedbokarvottord2Post({
      skilabod: {
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

    // console.log('RESSSSS', res)

    const certificates: MortgageCertificate[] =
      res.skilabodOgSkra?.map((resultItem) => {
        // console.log(resultItem.vedbandayfirlitPDFSkra)
        const contentBase64 = resultItem.vedbandayfirlitPDFSkra || ''
        // console.log('property number', resultItem.fastanumer)
        return {
          contentBase64: contentBase64,
          apiMessage: resultItem.skilabod,
          propertyNumber: resultItem.fastanumer,
        }
      }) ?? []

    console.log('CERTIFICATES: ', certificates)

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
      return certificates.map((certificate) => {
        // console.log('Certificate', certificate)
        const exists = certificate.contentBase64.length !== 0
        const hasKMarking =
          exists && certificate.contentBase64 !== 'Precondition Required'

        console.log('Does exist: ', {
          propertyNumber: certificate.propertyNumber ?? '',
          exists: exists,
          hasKMarking: hasKMarking,
        })
        return {
          propertyNumber: certificate.propertyNumber ?? '',
          exists: exists,
          hasKMarking: hasKMarking,
        }
      })
    } catch (exception) {
      return properties.map((property) => {
        return {
          propertyNumber: property.propertyNumber,
          exists: false,
          hasKMarking: false,
        }
      })
    }
  }

  async getPropertyDetails(propertyNumber: string): Promise<PropertyDetail> {
    const { id, api } = await this.createApi()

    const res = await api
      .vedbokavottordRegluverkiPost({
        skilabod: {
          audkenni: id,
          fastanumer: cleanPropertyNumber(propertyNumber),
          tegundAndlags: VedbondTegundAndlags.NUMBER_0, // 0 = Real estate
        },
      })
      .catch(() => {
        throw new Error()
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
            explanation: fasteign?.notkun,
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
        skilabod: {
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
      .catch(() => {
        throw new Error()
      })

    console.log('RES::::', res)

    return {
      propertyNumber: res.fastanum,
      propertyType: res.tegundEignar,
      realEstate: res.fasteign ? res.fasteign.map(mapRealEstateResponse) : [],
      vehicle: res.okutaeki ? mapVehicleResponse(res.okutaeki) : undefined,
      ship: res.skip ? mapShipResponse(res.skip) : undefined,
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
      skeyti: {
        audkenni: id,
        kennitala: nationalId,
      },
    })

    return mapDepartedToRegistryPerson(res)
  }

  async getInheritanceTax(dateOfDeath: Date): Promise<InheritanceTax> {
    const { id, api } = await this.createApi()
    const res = await api.erfdafjarskatturGet({
      audkenni: id,
      danardagur: dateOfDeath,
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
      payload: {
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
    return res.yfirlit?.map(mapEstateInfo) ?? []
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

  async checkCriminalRecord(nationalId: string) {
    const { id, api } = await this.createApi()
    return await api.kannaSakavottordGet({
      audkenni: id,
      kennitala: nationalId,
    })
  }
}
