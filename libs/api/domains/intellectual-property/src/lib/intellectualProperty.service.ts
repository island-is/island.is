import { Injectable } from '@nestjs/common'
import {
  TrademarksApi,
  PatentSearchApi,
  DesignSearchApi,
} from '@island.is/clients/intellectual-property'
import { Trademark } from './models/getTrademark.model'
import { User } from '@island.is/auth-nest-tools'
import { Design } from './models/getDesign.model'
import { PatentCollectionEntry } from './models/getPatentCollection.model'
import { Patent } from './models/getPatent.model'

@Injectable()
export class IntellectualPropertyService {
  constructor(
    private readonly trademarksApi: TrademarksApi,
    private readonly patentSearchApi: PatentSearchApi,
    private readonly designSearchApi: DesignSearchApi,
  ) {}

  async getTrademarks(user: User): Promise<Trademark[] | null> {
    const trademarks = await this.trademarksApi.trademarksGetTrademarksBySSNGet(
      { ssn: user.nationalId },
    )

    return trademarks.map((t) => ({
      ...t,
      applicationDate: t.applicationDate
        ? new Date(t.applicationDate)
        : undefined,
    }))
  }

  async getPatents(user: User): Promise<Array<PatentCollectionEntry> | null> {
    const patents = await this.patentSearchApi.apiPatentSearchPatentsBySSNGet({
      ssn: user.nationalId,
    })

    return patents as Array<PatentCollectionEntry>
  }
  async getPatentByApplicationNumber(appId: string): Promise<Patent | null> {
    const response = await this.patentSearchApi.apiPatentSearchSearchGet({
      applicationNr: appId,
    })

    const patent = response[0]

    return {
      ...patent,
    }
  }

  getDesigns = (user: User): Promise<Design[] | null> =>
    this.designSearchApi.designSearchGetDesignBySSNGet({ ssn: user.nationalId })
}
