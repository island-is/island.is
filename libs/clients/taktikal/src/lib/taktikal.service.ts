import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  CreateSigningProcess,
  CreateSigningProcesssigningPostAcceptEnum,
  FlowApi,
  MgmtFlowFilterflowGetAcceptEnum,
  SigningApi,
} from '../../gen/fetch'

@Injectable()
export class TaktikalService {
  constructor(
    private signingApi: SigningApi,
    private flowApi: FlowApi,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async signDocument(body: CreateSigningProcess) {
    try {
      return await this.signingApi.createSigningProcesssigningPost({
        body: body,
        accept: CreateSigningProcesssigningPostAcceptEnum.ApplicationJson,
      })
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async getCompanyFlows() {
    try {
      return await this.flowApi.mgmtFlowFilterflowGet({
        accept: MgmtFlowFilterflowGetAcceptEnum.ApplicationJson,
      })
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}
