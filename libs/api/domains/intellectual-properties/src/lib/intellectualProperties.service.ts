import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import type { User } from '@island.is/auth-nest-tools'
import { Design } from './models/design.model'
import addMonths from 'date-fns/addMonths'
import { isDefined } from '@island.is/shared/utils'
import { IntellectualPropertiesClientService } from '@island.is/clients/intellectual-properties'
import { Patent } from './models/patent.model'
import { Trademark, TrademarkType } from './models/trademark.model'
import { mapTrademarkType, mapTrademarkSubtype, mapFullAddress } from './mapper'
import { parseDateIfValid } from './utils'
import { Image } from './models/image.model'
import { PatentIS } from './models/patentIS.model'
import { PatentEP } from './models/patentEP.model'
import { SPC } from './models/spc.model'

const DATE_FORMAT = 'dd.MM.yyyy HH:mm:SS'

const parseIPDate = (date: Date | string | undefined | null) =>
  parseDateIfValid(date, DATE_FORMAT)

@Injectable()
export class IntellectualPropertiesService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private ipService: IntellectualPropertiesClientService,
  ) {}

  async getTrademarks(user: User): Promise<Array<Trademark> | null> {
    const trademarks = await this.ipService.getTrademarks(user)

    return trademarks
      .map((t) => {
        if (!t.vmid) {
          return null
        }

        return {
          ...t,
          id: t.vmid,
          text: t.text ?? '',
          status: t.status ?? '',
          type: mapTrademarkType(t.type) ?? undefined,
          typeReadable: t.type ?? '',
          subType: mapTrademarkSubtype(t) ?? undefined,
          vmId: t.vmid,
          applicationDate: parseIPDate(t.applicationDate),
        }
      })
      .filter(isDefined)
  }

  async getTrademarkByVmId(
    user: User,
    trademarkId: string,
  ): Promise<Trademark | null> {
    const trademark = await this.ipService.getTrademarkByVmId(user, trademarkId)

    const objectionDate = trademark.datePublished
      ? parseIPDate(trademark?.datePublished)
      : undefined

    if (!trademark.vmid) {
      return null
    }

    const type = mapTrademarkType(trademark.type) ?? undefined
    const mediaPath =
      type === TrademarkType.IMAGE || type === TrademarkType.TEXT_AND_IMAGE
        ? trademark.orginalImagePath
        : trademark.media?.mediaPath
    return {
      ...trademark,
      id: trademark.vmid,
      text: trademark.text ?? '',
      type: mapTrademarkType(trademark.type) ?? undefined,
      subType: mapTrademarkSubtype(trademark) ?? undefined,
      applicationNumber: trademark.applicationNumber ?? undefined,
      registrationNumber: trademark.registrationNumber ?? undefined,
      status: trademark.status ?? undefined,
      media: {
        mediaPath: mediaPath ?? undefined,
        mediaType: trademark.media?.mediaType ?? undefined,
      },
      markOwners: trademark.markOwners?.map((o) => ({
        name: o.name ?? '',
        addressFull: mapFullAddress([
          o.postalCode ?? undefined,
          o.county ?? undefined,
          o.country ?? undefined,
        ]),
        address: o.address ?? '',
        postalCode: o.postalCode ?? '',
        county: o.county ?? '',
        country: {
          name: o.country ?? '',
        },
        nationalId: o.ssn ?? '',
      })),
      markCategories: (trademark.markCategories ?? []).map((mc) => {
        return {
          categoryNumber: mc.categoryNumber ?? undefined,
          categoryDescription: mc.categoryDescription ?? undefined,
        }
      }),
      markAgent: trademark.markAgent
        ? {
            name: trademark?.markAgent?.name ?? '',
            addressFull: mapFullAddress([
              trademark.markAgent.address ?? undefined,
              trademark.markAgent.postalCode ?? undefined,
              trademark.markAgent.county ?? undefined,
            ]),
            address: trademark.markAgent.address ?? '',
            postalCode: trademark.markAgent.postalCode ?? '',
            county: trademark.markAgent.county ?? '',
            nationalId: trademark.markAgent.ssn ?? '',
          }
        : undefined,
      lifecycle: {
        applicationDate: parseIPDate(trademark.applicationDate),
        registrationDate: parseIPDate(trademark.dateRegistration),
        unregistrationDate: parseIPDate(trademark.dateUnRegistered),
        internationalRegistrationDate: parseIPDate(
          trademark.dateInternationalRegistration,
        ),
        expiryDate: parseIPDate(trademark.dateExpires),
        renewalDate: parseIPDate(trademark.dateRenewed),
        lastModified: parseIPDate(trademark.dateModified),
        publishDate: parseIPDate(trademark.datePublished),
        maxValidObjectionDate: objectionDate
          ? parseIPDate(addMonths(objectionDate, 2))
          : undefined,
      },
      imageCategories: trademark.imageCategories ?? '',
    }
  }

  async getPatents(user: User): Promise<Array<Patent> | null> {
    const patents = await this.ipService.getPatents(user)
    return patents
      .map((patent) => {
        const name = patent.patentName || patent.patentNameInOrgLanguage
        if (!patent.applicationNumber || !name) {
          return null
        }
        const mappedPatent: Patent = {
          id: patent.applicationNumber,
          applicationNumber: patent.applicationNumber,
          name,
          lifecycle: {
            applicationDate: parseIPDate(patent.applicationDate),
          },
          statusText: patent.statusText ?? '',
        }

        return mappedPatent
      })
      .filter(isDefined)
  }

  async getSPCById(user: User, spcId: string): Promise<SPC | null> {
    const res = await this.ipService.getSPCById(user, spcId)

    if (
      !res ||
      !res.product ||
      !res.parentPatent ||
      !res.id ||
      !res.spcNumber
    ) {
      return null
    }

    const spc: SPC = {
      ...res,
      name: res.product ?? undefined,
      applicationNumber: res.parentPatent ?? undefined,
      id: res.id.toString(),
      number: res.spcNumber,
      medicine: res.medicineName ?? undefined,
      medicineForChildren: res.medicineForChildren ?? undefined,
      message: res.message ?? undefined,
      status: res.status ?? undefined,
      owners: res.owners?.map((o) => ({
        id: o.id?.toString(),
        name: o.name ?? undefined,
        address: o.address ?? undefined,
        addressFull: mapFullAddress([
          o.address ?? undefined,
          o.postalCode ?? undefined,
          o.city ?? undefined,
          o.country?.code ?? undefined,
        ]),
        country: {
          name: o.country?.name ?? undefined,
          code: o.country?.code ?? undefined,
        },
      })),
      agent: {
        id: res.spcAgent?.id ?? undefined,
        nationalId: res.spcAgent?.ssn ?? undefined,
        name: res.spcAgent?.name ?? undefined,
        address: res.spcAgent?.address ?? undefined,
        addressFull: mapFullAddress([
          res.spcAgent?.address ?? undefined,
          res.spcAgent?.postalCode ?? undefined,
          res.spcAgent?.city ?? undefined,
          res.spcAgent?.country?.code ?? undefined,
        ]),
        postalCode: res.spcAgent?.postalCode ?? undefined,
        city: res.spcAgent?.city ?? undefined,
        telephone: res.spcAgent?.phone ?? undefined,
        mobilePhone: res.spcAgent?.mobile ?? undefined,
        email: res.spcAgent?.email ?? undefined,
        country: {
          code: res.spcAgent?.country?.code ?? undefined,
          name: res.spcAgent?.country?.code ?? undefined,
        },
      },
      grantPublishedInGazetteDate: parseIPDate(res.grantPublishedInGazetteDate),
      publishedInGazetteDate: parseIPDate(res.publishedInGazetteDate),
      lifecycle: {
        lastModified: parseIPDate(res.lastModified),
        applicationDate: parseIPDate(res.applicationDate),
        maxValidDate: parseIPDate(res.maxDuration),
      },
      marketingAuthorization: {
        icelandicAuthorizationDate: parseIPDate(
          res.dateIcelandicMarketingAuthorization,
        ),
        icelandicAuthorizationNumber:
          res.icelandicMarketingAuthorizationNumber ?? undefined,
        foreignAuthorizationDate: parseIPDate(
          res.dateForeignMarketingAuthorization,
        ),
        foreignAuthorizationNumber:
          res.foreignMarketingAuthorizationNumber ?? undefined,
      },
    }

    return spc
  }

  async getPatentById(
    user: User,
    patentId: string,
  ): Promise<PatentIS | PatentEP | null> {
    const response = await this.ipService.getPatentByApplicationNumber(
      user,
      patentId,
    )

    const patent = response[0]

    if (!patent) {
      return null
    }

    const name = patent.patentName || patent.patentNameInOrgLanguage

    if (!patent.applicationNumber || !name) {
      return null
    }

    const patentIS: PatentIS = {
      ...patent,
      id: patent.applicationNumber,
      applicationNumber: patent.applicationNumber,
      registrationNumber: patent.registrationNumber ?? undefined,
      error: patent.error ?? undefined,
      name,
      nameInOrgLanguage: patent.patentNameInOrgLanguage ?? undefined,
      status: patent.status ?? '',
      statusText: patent.statusText ?? '',
      alive: patent.alive,
      canRenew: patent.canRenew,
      annualFeesInfo: {
        nextPaymentDate: parseIPDate(patent.nextAnnualFee?.paymentDate),
        history: patent.annualFees
          ?.map((a) => {
            if (!a.id) {
              return null
            }
            return {
              id: a.id,
              paymentDate: parseIPDate(a.annualFeeDatePaid),
              paymentDueDate: parseIPDate(a.annualFeeDueDate),
              amount: a.annualFeeNumber ?? undefined,
              payor: a.paymentMadeBy ?? undefined,
              surcharge: a.surCharget,
            }
          })
          .filter(isDefined),
      },
      spcNumbers: patent.spcNumbers ?? undefined,
      classifications: patent.internalClassifications?.map((ic) => ({
        category: ic.category ?? '',
        sequence: ic.sequence ? parseInt(ic.sequence) : undefined,
        creationDate: parseIPDate(ic.createDate),
        publicationDate: parseIPDate(ic.datePublised),
        type: ic.type ?? '',
      })),
      priorities: patent.priorities?.map((p) => ({
        applicationDate: parseIPDate(p.dateApplication),
        countryCode: p.country?.code ?? undefined,
        countryName: p.country?.code ?? undefined,
        number: p.number ?? '',
        creationDate: parseIPDate(p.createDate),
      })),
      pct: {
        number: patent.pct?.pctNumber ?? '',
        date: parseIPDate(patent.pct?.pctDate),
      },
      owners: [
        {
          name: patent.ownerName ?? '',
          address: patent.ownerHome ?? '',
          addressFull: mapFullAddress([
            patent.ownerHome ?? undefined,
            patent.ownerCountry?.code ?? undefined,
          ]),
          country: {
            name: patent.ownerCountry?.name ?? '',
            code: patent.ownerCountry?.code ?? '',
          },
        },
      ],
      agent: {
        id: patent.patentAgent?.id ?? '',
        nationalId: patent.patentAgent?.ssn ?? '',
        name: patent.patentAgent?.name ?? '',
        address: patent.patentAgent?.address ?? '',
        addressFull: mapFullAddress([
          patent.patentAgent?.address ?? undefined,
          patent.patentAgent?.postalCode ?? undefined,
          patent.patentAgent?.city ?? undefined,
        ]),
        postalCode: patent.patentAgent?.postalCode ?? '',
        city: patent.patentAgent?.city ?? '',
        mobilePhone: patent.patentAgent?.mobile ?? '',
        telephone: patent.patentAgent?.phone ?? '',
        email: patent.patentAgent?.email ?? '',
        country: {
          name: patent.patentAgent?.country?.name ?? '',
          code: patent.patentAgent?.country?.code ?? '',
        },
      },
      inventors: patent?.inventors
        ?.map((i) => ({
          ...i,
          name: i.name ?? '',
          addressFull: mapFullAddress([
            i.address ?? undefined,
            i.postalCode ?? undefined,
            i.city ?? undefined,
            i.country?.code ?? undefined,
          ]),
          address: i.address ?? '',
          postalCode: i.postalCode ?? '',
          city: i.city ?? '',
          county: i.county ?? '',
          country: {
            name: patent.ownerCountry?.name ?? '',
            code: patent.ownerCountry?.code ?? '',
          },
        }))
        .filter(isDefined),
      lifecycle: {
        applicationDate: parseIPDate(patent.appDate),
        registrationDate: parseIPDate(patent.regDate),
        expiryDate: parseIPDate(patent.expires),
        publishDate: parseIPDate(patent.applicationDatePublishedAsAvailable),
        maxValidDate: parseIPDate(patent.maxValidDate),
        maxValidObjectionDate: patent.regDate
          ? parseIPDate(addMonths(patent.regDate, 9))
          : undefined,
        lastModified: parseIPDate(patent.lastModified),
      },
    }

    if (patent.epApplicationNumber) {
      const patentEP: PatentEP = {
        ...patentIS,
        epApplicationNumber: patent.epApplicationNumber,
        nameInIcelandic: patent.patentIcelandicName ?? undefined,
        classificationType: patent.classificationType ?? undefined,
        epoStatus: patent.epoStatus ?? undefined,
        language: patent.language ?? undefined,
        epLifecycle: {
          provisionDatePublishedInGazette: parseIPDate(
            patent.epDateProvisionPublishedInGazette,
          ),
          publishDate: parseIPDate(patent.epDatePublication),
          applicationDate: parseIPDate(patent.epApplicationDate),
          translationSubmissionDate: parseIPDate(
            patent.epDateTranslationSubmitted,
          ),
        },
      }
      return patentEP
    }

    return patentIS
  }

  async getDesigns(user: User): Promise<Array<Design> | null> {
    const designs = await this.ipService.getDesigns(user)
    return designs
      .map((design) => {
        if (!design.hid) {
          return null
        }
        return {
          ...design,
          id: design.hid,
          status: design.status ?? '',
          specification: {
            description: design.specification ?? '',
          },
        }
      })
      .filter(isDefined)
  }

  async getDesignById(user: User, designId: string): Promise<Design | null> {
    const response = await this.ipService.getDesignByHID(user, designId)

    const object: Design = {
      ...response,
      id: designId,
      applicationNumber: response.applicationNumber ?? '',
      lifecycle: {
        applicationDate: parseIPDate(response.applicationDate),
        applicationDateAvailable: parseIPDate(
          response.applicationDateAvailable,
        ),
        applicationDatePublishedAsAvailable: parseIPDate(
          response.applicationDatePublishedAsAvailable,
        ),
        applicationDeadlineDate: parseIPDate(response.applicationDeadlineDate),
        internationalRegistrationDate: parseIPDate(
          response.internationalRegistrationDate,
        ),
        announcementDate: parseIPDate(response.announcementDate),
        registrationDate: parseIPDate(response.registrationDate),
        publishDate: parseIPDate(response.publishDate),
        createDate: parseIPDate(response.createDate),
        lastModified: parseIPDate(response.lastModified),
        expiryDate: parseIPDate(response.validTo),
      },
      status: response.status ?? '',
      specification: {
        description: response.specification?.description ?? '',
        number: response.specification?.number ?? '',
        designIsDecoration: response.specification?.designIsDecoration ?? '',
        designShouldBeProtectedInColors:
          response.specification?.designShouldBeProtectedInColors ?? '',
        specificationText: response.specification?.specificationText ?? '',
        specificationCount: response.specification?.specificationCount ?? '',
      },
      classification: response.classification?.category?.map((c) => ({
        category: c,
      })),
      owners: response.owners?.map((o) => ({
        name: o.name ?? '',
        addressFull: mapFullAddress([
          o.address ?? undefined,
          o.postalcode ?? undefined,
          o.city ?? undefined,
          o.countryDetails?.code ?? undefined,
        ]),
        address: o.address ?? '',
        postalCode: o.postalcode ?? '',
        city: o.city ?? '',
        country: {
          name: o.country ?? '',
          code: o.countryDetails?.code ?? '',
        },
        email: o.email ?? '',
        telephone: o.telephone ?? '',
        mobilePhone: o.mobilephone ?? '',
        nationalId: o.ssn ?? '',
      })),
      designers: response.designers?.map((d) => ({
        name: d.name ?? '',
        addressFull: mapFullAddress([
          d.address ?? undefined,
          d.postalcode ?? undefined,
          d.city ?? undefined,
          d.countryDetails?.code ?? undefined,
        ]),
        address: d.address ?? '',
        postalCode: d.postalcode ?? '',
        city: d.city ?? '',
        country: {
          name: d.country ?? '',
          code: d.countryDetails?.code ?? '',
        },
        email: d.email ?? '',
        telephone: d.telephone ?? '',
        mobilePhone: d.mobilephone ?? '',
        nationalId: d.ssn ?? '',
      })),
      agent: {
        name: response?.agent?.name ?? '',
        address: response?.agent?.address ?? '',
        addressFull: mapFullAddress([
          response?.agent?.address ?? undefined,
          response?.agent?.postalcode ?? undefined,
          response?.agent?.city ?? undefined,
          response?.agent?.countryDetails?.code ?? undefined,
        ]),
        postalCode: response?.agent?.postalcode ?? '',
        city: response?.agent?.city ?? '',
        country: {
          name: response?.agent?.country ?? '',
          code: response?.agent?.countryDetails?.code ?? '',
        },
        email: response?.agent?.email ?? '',
        telephone: response?.agent?.telephone ?? '',
        mobilePhone: response?.agent?.mobilephone ?? '',
        nationalId: response?.agent?.ssn ?? '',
      },
    }

    return object
  }

  async getDesignImages(
    user: User,
    designId: string,
  ): Promise<Array<Image> | null> {
    const response = await this.ipService.getDesignImages(user, designId)

    const designImages = response
      .flatMap(({ designNumber, designImage }) =>
        designImage?.flatMap((i) => ({
          designNumber,
          imageNumber: i.imageNumber,
          image: i.value ?? undefined,
        })),
      )
      .filter(isDefined)

    return designImages
  }

  getDesignImage(
    user: User,
    designId: string,
    designNumber: string,
    imageNumber: string,
    size?: string,
  ) {
    return this.ipService.getDesignImage(
      user,
      designId,
      designNumber,
      imageNumber,
      size,
    )
  }
}
