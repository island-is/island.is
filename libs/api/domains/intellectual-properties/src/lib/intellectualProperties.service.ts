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

const DATE_FORMAT = 'dd.MM.yyyy HH:mm:SS'

const parseTrademarkDate = (date: Date | string | undefined | null) =>
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
          text: t.text ?? '',
          status: t.status ?? '',
          type: mapTrademarkType(t.type) ?? undefined,
          typeReadable: t.type ?? '',
          subType: mapTrademarkSubtype(t) ?? undefined,
          vmId: t.vmid,
          applicationDate: parseTrademarkDate(t.applicationDate),
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
      ? parseTrademarkDate(trademark?.datePublished)
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
      vmId: trademark.vmid,
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
        addressFull: mapFullAddress(
          undefined,
          o.postalCode ?? undefined,
          o.county ?? undefined,
        ),
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
            addressFull: mapFullAddress(
              trademark.markAgent.address ?? undefined,
              trademark.markAgent.postalCode ?? undefined,
              trademark.markAgent.county ?? undefined,
            ),
            address: trademark.markAgent.address ?? '',
            postalCode: trademark.markAgent.postalCode ?? '',
            county: trademark.markAgent.county ?? '',
            nationalId: trademark.markAgent.ssn ?? '',
          }
        : undefined,
      lifecycle: {
        applicationDate: parseTrademarkDate(trademark.applicationDate),
        registrationDate: parseTrademarkDate(trademark.dateRegistration),
        unregistrationDate: parseTrademarkDate(trademark.dateUnRegistered),
        internationalRegistrationDate: parseTrademarkDate(
          trademark.dateInternationalRegistration,
        ),
        expiryDate: parseTrademarkDate(trademark.dateExpires),
        renewalDate: parseTrademarkDate(trademark.dateRenewed),
        lastModified: parseTrademarkDate(trademark.dateModified),
        publishDate: parseTrademarkDate(trademark.datePublished),
        maxValidObjectionDate: objectionDate
          ? addMonths(objectionDate, 2)
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
          ...patent,
          applicationNumber: patent.applicationNumber,
          name,
          lifecycle: {
            applicationDate: parseTrademarkDate(patent.applicationDate),
          },
          statusText: patent.statusText ?? '',
        }

        return mappedPatent
      })
      .filter(isDefined)
  }

  async getPatentById(user: User, patentId: string): Promise<Patent | null> {
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

    return {
      ...patent,
      applicationNumber: patent.applicationNumber,
      epApplicationNumber: patent.epApplicationNumber ?? undefined,
      name,
      nameInOrgLanguage: patent.patentNameInOrgLanguage ?? undefined,
      classifications: patent.internalClassifications?.map((ic) => ({
        category: ic.category ?? '',
        sequence: ic.sequence ? parseInt(ic.sequence) : undefined,
        creationDate: parseTrademarkDate(ic.createDate),
        publicationDate: parseTrademarkDate(ic.datePublised),
        type: ic.type ?? '',
      })),
      priorites: patent.priorities?.map((p) => ({
        applicationDate: parseTrademarkDate(p.dateApplication),
        country: {
          code: p.country?.code ?? '',
          name: p.country?.name ?? '',
        },
        number: p.number ?? '',
        creationDate: parseTrademarkDate(p.createDate),
      })),
      pct: {
        number: patent.pct?.pctNumber ?? '',
        date: parseTrademarkDate(patent.pct?.pctDate),
      },
      owner: {
        name: patent.ownerName ?? '',
        address: patent.ownerHome ?? '',
        addressFull: mapFullAddress(patent.ownerHome ?? undefined),
        country: {
          name: patent.ownerCountry?.name ?? '',
          code: patent.ownerCountry?.code ?? '',
        },
      },
      agent: {
        id: patent.patentAgent?.id ?? '',
        nationalId: patent.patentAgent?.ssn ?? '',
        name: patent.patentAgent?.name ?? '',
        address: patent.patentAgent?.address ?? '',
        addressFull: mapFullAddress(
          patent.patentAgent?.address ?? undefined,
          patent.patentAgent?.postalCode ?? undefined,
          patent.patentAgent?.city ?? undefined,
        ),
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
          addressFull: mapFullAddress(
            i.address ?? undefined,
            i.postalCode ?? undefined,
            i.city ?? undefined,
          ),
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
        applicationDate: parseTrademarkDate(patent.appDate),
        registrationDate: parseTrademarkDate(patent.regDate),
        expiryDate: parseTrademarkDate(patent.expires),
        publishDate: parseTrademarkDate(
          patent.applicationDatePublishedAsAvailable,
        ),
        maxValidDate: parseTrademarkDate(patent.maxValidDate),
        lastModified: parseTrademarkDate(patent.lastModified),
      },
      epApplicationDate: parseTrademarkDate(patent.epApplicationDate),
      epProvisionPublishedInGazette: parseTrademarkDate(
        patent.epDateProvisionPublishedInGazette,
      ),
      epTranslationSubmittedDate: parseTrademarkDate(
        patent.epDateTranslationSubmitted,
      ),
      epPublishDate: parseTrademarkDate(patent.epDatePublication),
      status: patent.status ?? '',
      statusText: patent.statusText ?? '',
    }
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
          hId: design.hid,
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
      hId: designId,
      applicationNumber: response.applicationNumber ?? '',
      lifecycle: {
        applicationDate: parseTrademarkDate(response.applicationDate),
        applicationDateAvailable: parseTrademarkDate(
          response.applicationDateAvailable,
        ),
        applicationDatePublishedAsAvailable: parseTrademarkDate(
          response.applicationDatePublishedAsAvailable,
        ),
        applicationDeadlineDate: parseTrademarkDate(
          response.applicationDeadlineDate,
        ),
        internationalRegistrationDate: parseTrademarkDate(
          response.internationalRegistrationDate,
        ),
        announcementDate: parseTrademarkDate(response.announcementDate),
        registrationDate: parseTrademarkDate(response.registrationDate),
        publishDate: parseTrademarkDate(response.publishDate),
        createDate: parseTrademarkDate(response.createDate),
        lastModified: parseTrademarkDate(response.lastModified),
        expiryDate: parseTrademarkDate(response.validTo),
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
        addressFull: mapFullAddress(
          o.address ?? undefined,
          o.postalcode ?? undefined,
          o.city ?? undefined,
        ),
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
        addressFull: mapFullAddress(
          d.address ?? undefined,
          d.postalcode ?? undefined,
          d.city ?? undefined,
        ),
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
        addressFull: mapFullAddress(
          response?.agent?.address ?? undefined,
          response?.agent?.postalcode ?? undefined,
          response?.agent?.city ?? undefined,
        ),
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
