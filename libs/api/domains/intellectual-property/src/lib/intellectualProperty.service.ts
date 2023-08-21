import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { IntellectualPropertyClientService } from '@island.is/clients/intellectual-property'
import type { User } from '@island.is/auth-nest-tools'
import { Patent } from './models/getPatent.model'
import {
  Trademark,
  TrademarkSubType,
  TrademarkType,
} from './models/getTrademark.model'
import { Design } from './models/getDesign.model'
import { Image } from './models/getDesignImage.model'
import addMonths from 'date-fns/addMonths'
import { parseDate } from './utils'
import { mapTrademarkSubtype, mapTrademarkType } from './mapper'

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
        ? new Date(t.applicationDate)
        : undefined,
    })) as Array<Trademark>
  }

  async getTrademarkByVmId(
    user: User,
    trademarkId: string,
  ): Promise<Trademark | null> {
    const trademark = await this.ipService.getTrademarkByVmId(user, trademarkId)

    return {
      ...trademark,
      type: mapTrademarkType(trademark.type) ?? undefined,
      subType: mapTrademarkSubtype(trademark) ?? undefined,
      applicationDate: trademark.applicationDate
        ? parseDate(trademark.applicationDate)
        : undefined,
      dateRegistration: trademark.dateRegistration
        ? parseDate(trademark.dateRegistration)
        : undefined,
      dateUnRegistered: trademark.dateUnRegistered
        ? parseDate(trademark.dateUnRegistered)
        : undefined,
      dateExpires: trademark.dateExpires
        ? parseDate(trademark.dateExpires)
        : undefined,
      dateRenewed: trademark.dateRenewed
        ? parseDate(trademark.dateRenewed)
        : undefined,
      dateInternationalRegistration: trademark.dateInternationalRegistration
        ? parseDate(trademark.dateInternationalRegistration)
        : undefined,
      dateModified: trademark.dateModified
        ? parseDate(trademark.dateModified)
        : undefined,
      datePublished: trademark.datePublished
        ? parseDate(trademark.datePublished)
        : undefined,
      maxValidObjectionDate: trademark.datePublished
        ? addMonths(parseDate(trademark.datePublished), 2)
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

  getDesigns = async (user: User): Promise<Array<Design> | null> =>
    (await this.ipService.getDesigns(user)) as Array<Design>

  async getDesignById(user: User, designId: string): Promise<Design | null> {
    const response = await this.ipService.getDesignByHID(user, designId)

    return {
      ...response,
      expiryDate: response?.validTo,
      classification: response.classification?.category,
    }
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
