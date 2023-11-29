import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { IntellectualPropertyClientService } from '@island.is/clients/intellectual-property'
import type { User } from '@island.is/auth-nest-tools'
import { Patent } from './models/getPatent.model'
import { Trademark } from './models/getTrademark.model'
import { Design } from './models/design.model'
import { Image } from './models/getDesignImage.model'
import addMonths from 'date-fns/addMonths'
import { mapTrademarkSubtype, mapTrademarkType } from './mapper'
import { parseDateIfValid } from './utils'
import { isDefined } from '@island.is/shared/utils'

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
      applicationDate: parseDateIfValid(t.applicationDate),
    })) as Array<Trademark>
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

    return {
      ...trademark,
      type: mapTrademarkType(trademark.type) ?? undefined,
      subType: mapTrademarkSubtype(trademark) ?? undefined,
      applicationDate: formatDate(trademark.applicationDate),
      dateRegistration: formatDate(trademark.dateRegistration),
      dateUnRegistered: formatDate(trademark.dateUnRegistered),
      dateExpires: formatDate(trademark.dateExpires),
      dateRenewed: formatDate(trademark.dateRenewed),
      dateInternationalRegistration: formatDate(
        trademark.dateInternationalRegistration,
      ),
      dateModified: formatDate(trademark.dateModified),
      datePublished: formatDate(trademark.datePublished),
      maxValidObjectionDate: objectionDate
        ? addMonths(objectionDate, 2)
        : undefined,
      vmId: trademark.vmid,
      acquiredDistinctiveness: trademark.skradVegnaMarkadsfestu,
    }
  }

  async getPatents(user: User): Promise<Array<Patent> | null> {
    const patents = await this.ipService.getPatents(user)
    return patents.map((patent) => ({
      ...patents,
      applicationDate: parseDateIfValid(patent.applicationDate),
    }))
  }
  async getPatentById(user: User, patentId: string): Promise<Patent | null> {
    const response = await this.ipService.getPatentByApplicationNumber(
      user,
      patentId,
    )

    const patent = response[0]
    const registeredDate = parseDateIfValid(patent.registeredDate)

    return {
      ...patent,
      maxValidObjectionDate: registeredDate
        ? addMonths(registeredDate, 9)
        : undefined,
    }
  }

  async getDesigns(user: User): Promise<Array<Design> | null> {
    const designs = await this.ipService.getDesigns(user)
    return designs.map((design) => ({
      ...design,
      specification: design.specification,
      applicationDate: parseDateIfValid(design.applicationDate),
    })) as Array<Design>
  }

  async getDesignById(user: User, designId: string): Promise<Design | null> {
    const response = await this.ipService.getDesignByHID(user, designId)

    const object: Design = {
      ...response,
      hId: designId,
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
      classification: response.classification?.category,
      objections: response.objections?.map((o) => {
        return {
          ...o,
          dateReceived: parseDateIfValid(o.dateReceived),
          dateConclusion: parseDateIfValid(o.dateConclusion),
        }
      }),
      appeals: response.appeals?.map((o) => {
        return {
          ...o,
          dateReceived: parseDateIfValid(o.dateReceived),
          dateConclusion: parseDateIfValid(o.dateConclusion),
        }
      }),
      licenses: response.licenses?.map((license) => {
        return {
          ...license,
          date: parseDateIfValid(license.date),
          expires: parseDateIfValid(license.expires),
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
