import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { IntellectualPropertyClientService } from '@island.is/clients/intellectual-property'
import type { User } from '@island.is/auth-nest-tools'
import { Patent } from './models/getPatent.model'
import { Trademark } from './models/getTrademark.model'
import { Design } from './models/getDesign.model'
import { Image } from './models/getDesignImage.model'
import addMonths from 'date-fns/addMonths'
import { mapTrademarkSubtype, mapTrademarkType } from './mapper'
import { parseDateIfValid } from './utils'

type ExcludesFalse = <T>(x: T | null | undefined | false | '') => x is T

@Injectable()
export class IntellectualPropertyService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(IntellectualPropertyClientService)
    private ipService: IntellectualPropertyClientService,
  ) {}

  async getTrademarks(user: User): Promise<Array<Trademark> | null> {
    const trademarks = await this.ipService.getTrademarks(user)

    return trademarks.map((t) => ({
      ...t,
      type: mapTrademarkType(t.type) ?? undefined,
      subType: mapTrademarkSubtype(t) ?? undefined,
      vmId: t.vmid,
      applicationDate: t.applicationDate
        ? parseDateIfValid(t.applicationDate)
        : undefined,
    })) as Array<Trademark>
  }

  async getTrademarkByVmId(
    user: User,
    trademarkId: string,
  ): Promise<Trademark | null> {
    const trademark = await this.ipService.getTrademarkByVmId(user, trademarkId)

    const formatDate = (date: string) =>
      parseDateIfValid(date, 'dd.MM.yyyy HH:mm:ss')

    const objectionDate = trademark.datePublished
      ? formatDate(trademark?.datePublished)
      : undefined

    return {
      ...trademark,
      type: mapTrademarkType(trademark.type) ?? undefined,
      subType: mapTrademarkSubtype(trademark) ?? undefined,
      applicationDate: trademark.applicationDate
        ? formatDate(trademark.applicationDate)
        : undefined,
      dateRegistration: trademark.dateRegistration
        ? formatDate(trademark.dateRegistration)
        : undefined,
      dateUnRegistered: trademark.dateUnRegistered
        ? formatDate(trademark.dateUnRegistered)
        : undefined,
      dateExpires: trademark.dateExpires
        ? formatDate(trademark.dateExpires)
        : undefined,
      dateRenewed: trademark.dateRenewed
        ? formatDate(trademark.dateRenewed)
        : undefined,
      dateInternationalRegistration: trademark.dateInternationalRegistration
        ? formatDate(trademark.dateInternationalRegistration)
        : undefined,
      dateModified: trademark.dateModified
        ? formatDate(trademark.dateModified)
        : undefined,
      datePublished: trademark.datePublished
        ? formatDate(trademark.datePublished)
        : undefined,
      maxValidObjectionDate: objectionDate
        ? addMonths(objectionDate, 2)
        : undefined,
      vmId: trademark.vmid,
      acquiredDistinctiveness: trademark.skradVegnaMarkadsfestu,
    }
  }

  async getPatents(user: User): Promise<Array<Patent> | null> {
    const patents = await this.ipService.getPatents(user)
    return patents as Array<Patent>
  }
  async getPatentById(user: User, patentId: string): Promise<Patent | null> {
    const response = await this.ipService.getPatentByApplicationNumber(
      user,
      patentId,
    )

    const patent = response[0]

    return {
      ...patent,
      maxValidObjectionDate: patent.registeredDate
        ? addMonths(new Date(patent.registeredDate), 9)
        : undefined,
    }
  }

  async getDesigns(user: User): Promise<Array<Design> | null> {
    const designs = await this.ipService.getDesigns(user)
    return designs.map((design) => ({
      ...design,
      applicationDate: design.applicationDate
        ? parseDateIfValid(design.applicationDate)
        : undefined,
    })) as Array<Trademark>
  }

  async getDesignById(user: User, designId: string): Promise<Design | null> {
    const response = await this.ipService.getDesignByHID(user, designId)

    const object: Design = {
      ...response,
      hId: designId,
      applicationDate: response.applicationDate
        ? parseDateIfValid(response.applicationDate)
        : undefined,
      applicationDateAvailable: response.applicationDateAvailable
        ? parseDateIfValid(response.applicationDateAvailable)
        : undefined,
      applicationDatePublishedAsAvailable: response.applicationDatePublishedAsAvailable
        ? parseDateIfValid(response.applicationDatePublishedAsAvailable)
        : undefined,
      applicationDeadlineDate: response.applicationDeadlineDate
        ? parseDateIfValid(response.applicationDeadlineDate)
        : undefined,
      internationalRegistrationDate: response.internationalRegistrationDate
        ? parseDateIfValid(response.internationalRegistrationDate)
        : undefined,
      announcementDate: response.announcementDate
        ? parseDateIfValid(response.announcementDate)
        : undefined,
      registrationDate: response.registrationDate
        ? parseDateIfValid(response.registrationDate)
        : undefined,
      publishDate: response.publishDate
        ? parseDateIfValid(response.publishDate)
        : undefined,
      createDate: response.createDate
        ? parseDateIfValid(response.createDate)
        : undefined,
      lastModified: response.lastModified
        ? parseDateIfValid(response.lastModified)
        : undefined,
      expiryDate: response.validTo
        ? parseDateIfValid(response.validTo)
        : undefined,
      classification: response.classification?.category,
      objections: response.objections?.map((o) => {
        return {
          ...o,
          dateReceived: o.dateReceived
            ? parseDateIfValid(o.dateReceived)
            : undefined,
          dateConclusion: o.dateConclusion
            ? parseDateIfValid(o.dateConclusion)
            : undefined,
        }
      }),
      appeals: response.appeals?.map((o) => {
        return {
          ...o,
          dateReceived: o.dateReceived
            ? parseDateIfValid(o.dateReceived)
            : undefined,
          dateConclusion: o.dateConclusion
            ? parseDateIfValid(o.dateConclusion)
            : undefined,
        }
      }),
      licenses: response.licenses?.map((license) => {
        return {
          ...license,
          date: license.date ? parseDateIfValid(license.date) : undefined,
          expires: license.expires
            ? parseDateIfValid(license.expires)
            : undefined,
        }
      }),
    }

    return object
  }

  async getDesignImages(
    user: User,
    designId: string,
  ): Promise<Array<Image> | null> {
    const response = await this.ipService.getDesignImages(user, designId)

    //shady stuff
    const designImages = response
      .flatMap(({ designNumber, designImage }) =>
        designImage?.flatMap(
          (i) =>
            ({
              designNumber,
              imageNumber: i.imageNumber,
              image: i.value,
            } as Image),
        ),
      )
      .filter((Boolean as unknown) as ExcludesFalse)

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
