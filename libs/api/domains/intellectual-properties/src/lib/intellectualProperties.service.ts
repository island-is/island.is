import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import type { User } from '@island.is/auth-nest-tools'
import { Design } from './models/design.model'
import addMonths from 'date-fns/addMonths'
import { isDefined } from '@island.is/shared/utils'
import { IntellectualPropertiesClientService } from '@island.is/clients/intellectual-properties'
import { Patent } from './models/patent.model'
import { Trademark } from './models/trademark.model'
import { mapTrademarkType, mapTrademarkSubtype, mapFullAddress } from './mapper'
import { parseDateIfValid } from './models/utils'
import { Image } from './models/image.model'

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
          applicationDate: parseDateIfValid(t.applicationDate),
        }
      })
      .filter(isDefined)
  }

  async getTrademarkByVmId(
    user: User,
    trademarkId: string,
  ): Promise<Trademark | null> {
    const trademark = await this.ipService.getTrademarkByVmId(user, trademarkId)

    const formatDate = (date: string | undefined | null) =>
      parseDateIfValid(date, 'dd.MM.yyyy HH:mm:ss')

    const objectionDate = trademark.datePublished
      ? formatDate(trademark?.datePublished)
      : undefined

    if (!trademark.vmid) {
      return null
    }

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
        mediaPath:
          trademark.orginalImagePath ?? trademark.media?.mediaPath ?? undefined,
        mediaType: trademark.media?.mediaPath ?? undefined,
      },
      markOwners: trademark.markOwners?.map((o) => ({
        name: o.name ?? '',
        addressFull: mapFullAddress(o.address, o.postalCode, o.county),
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
              trademark.markAgent.address,
              trademark.markAgent.postalCode,
              trademark.markAgent.county,
            ),
            address: trademark.markAgent.address ?? '',
            postalCode: trademark.markAgent.postalCode ?? '',
            county: trademark.markAgent.county ?? '',
            nationalId: trademark.markAgent.ssn ?? '',
          }
        : undefined,
      lifecycle: {
        applicationDate: formatDate(trademark.applicationDate),
        registrationDate: formatDate(trademark.dateRegistration),
        unregistrationDate: formatDate(trademark.dateUnRegistered),
        internationalRegistrationDate: formatDate(
          trademark.dateInternationalRegistration,
        ),
        expiryDate: formatDate(trademark.dateExpires),
        renewalDate: formatDate(trademark.dateRenewed),
        lastModified: formatDate(trademark.dateModified),
        publishDate: formatDate(trademark.datePublished),
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
        if (!patent.applicationNumber || !patent.patentName) {
          return null
        }
        const mappedPatent: Patent = {
          ...patent,
          applicationNumber: patent.applicationNumber,
          name: patent.patentName,
          lifecycle: {
            applicationDate: parseDateIfValid(patent.applicationDate),
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

    if (!patent.applicationNumber || !patent.patentName) {
      return null
    }

    return {
      ...patent,
      applicationNumber: patent.applicationNumber,
      name: patent.patentName,
      owner: {
        name: patent.ownerName ?? '',
        address: patent.ownerHome ?? '',
        addressFull: mapFullAddress(patent.ownerHome),
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
          patent.patentAgent?.address,
          patent.patentAgent?.postalCode,
          patent.patentAgent?.city,
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
          addressFull: mapFullAddress(i.address, i.postalCode, i.city),
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
        ...patent,
        registrationDate: parseDateIfValid(patent.registeredDate),
      },
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
        applicationDate: parseDateIfValid(response.applicationDate),
        applicationDateAvailable: parseDateIfValid(
          response.applicationDateAvailable,
        ),
        applicationDatePublishedAsAvailable: parseDateIfValid(
          response.applicationDatePublishedAsAvailable,
        ),
        applicationDeadlineDate: parseDateIfValid(
          response.applicationDeadlineDate,
        ),
        internationalRegistrationDate: parseDateIfValid(
          response.internationalRegistrationDate,
        ),
        announcementDate: parseDateIfValid(response.announcementDate),
        registrationDate: parseDateIfValid(response.registrationDate),
        publishDate: parseDateIfValid(response.publishDate),
        createDate: parseDateIfValid(response.createDate),
        lastModified: parseDateIfValid(response.lastModified),
        expiryDate: parseDateIfValid(response.validTo),
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
      classification: response.classification?.category ?? [],
      owners: response.owners?.map((o) => ({
        name: o.name ?? '',
        addressFull: mapFullAddress(o.address, o.postalcode, o.city),
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
        addressFull: mapFullAddress(d.address, d.postalcode, d.city),
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
          response?.agent?.address,
          response?.agent?.postalcode,
          response?.agent?.city,
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
