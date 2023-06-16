import { Injectable } from '@nestjs/common'
import {
  TrademarksApi,
  PatentSearchApi,
  DesignSearchApi,
} from '@island.is/clients/intellectual-property'
import { Trademark } from './models/getTrademark.model'
import { User } from '@island.is/auth-nest-tools'
import { Patent } from './models/getPatents.model'
import { Design } from './models/getDesign.model'

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

  getPatents = (user: User): Promise<Patent[] | null> =>
    this.patentSearchApi.apiPatentSearchPatentsBySSNGet({
      ssn: user.nationalId,
    })

  getPatentByApplicationNumber = (appId: string) =>
    this.patentSearchApi.apiPatentSearchSearchGet({ applicationNr: appId })

  getDesigns = (user: User): Promise<Design[] | null> =>
    this.designSearchApi.designSearchGetDesignBySSNGet({ ssn: user.nationalId })
}
