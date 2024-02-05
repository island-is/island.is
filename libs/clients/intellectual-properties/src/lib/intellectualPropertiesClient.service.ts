import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  DesignSearchApi,
  PatentSearchApi,
  SPCApi,
  TrademarksApi,
} from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

@Injectable()
export class IntellectualPropertiesClientService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private trademarksApi: TrademarksApi,
    private patentSearchApi: PatentSearchApi,
    private designSearchApi: DesignSearchApi,
    private spcApi: SPCApi,
  ) {}

  private trademarksApiWithAuth = (user: User) =>
    this.trademarksApi.withMiddleware(new AuthMiddleware(user as Auth))
  private patentSearchApiWithAuth = (user: User) =>
    this.patentSearchApi.withMiddleware(new AuthMiddleware(user as Auth))
  private designSearchApiWithAuth = (user: User) =>
    this.designSearchApi.withMiddleware(new AuthMiddleware(user as Auth))
  private spcApiWithAuth = (user: User) =>
    this.spcApi.withMiddleware(new AuthMiddleware(user as Auth))

  getTrademarks(user: User) {
    return this.trademarksApiWithAuth(user).trademarksGetTrademarksBySSNGet({
      ssn: user.nationalId,
    })
  }

  getTrademarkByVmId(user: User, vmId: string) {
    return this.trademarksApiWithAuth(user).trademarksGetByIdGet({
      key: vmId,
    })
  }

  getPatents(user: User) {
    return this.patentSearchApiWithAuth(user).apiPatentSearchPatentsBySSNGet({
      ssn: user.nationalId,
    })
  }

  getPatentByApplicationNumber(user: User, appId: string) {
    return this.patentSearchApiWithAuth(user).apiPatentSearchSearchGet({
      applicationNr: appId,
    })
  }

  getSPCById(user: User, spcId: string) {
    return this.spcApiWithAuth(user).sPCIdGet({ id: spcId })
  }

  getDesigns(user: User) {
    return this.designSearchApiWithAuth(user).designSearchGetDesignBySSNGet({
      ssn: user.nationalId,
    })
  }

  getDesignByHID(user: User, hId: string) {
    return this.designSearchApiWithAuth(user).designSearchGetByHIDGet({
      hid: hId,
    })
  }

  getDesignImages(user: User, hId: string) {
    return this.designSearchApiWithAuth(user).designSearchGetDesignsGet({
      hid: hId,
    })
  }

  getDesignImage(
    user: User,
    hId: string,
    designNumber: string,
    imageNumber: string,
    size?: string,
  ) {
    return this.designSearchApiWithAuth(user).designSearchGetDesignImageGet({
      hid: hId,
      designNumber,
      imageNumber,
      size,
    })
  }
}
