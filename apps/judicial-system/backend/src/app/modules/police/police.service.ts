import { Agent } from 'https'
import fetch from 'isomorphic-fetch'

import {
  BadGatewayException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  createXRoadAPIPath,
  XRoadMemberClass,
} from '@island.is/shared/utils/server'
import type { PoliceCaseFile } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'

@Injectable()
export class PoliceService {
  private xRoadPath = createXRoadAPIPath(
    environment.xRoad.basePathWithEnv,
    XRoadMemberClass.GovernmentInstitution,
    environment.policeServiceOptions.memberCode,
    environment.policeServiceOptions.apiPath,
  )

  private agent = new Agent({
    cert: environment.xRoad.clientCert,
    key: environment.xRoad.clientKey,
    ca: environment.xRoad.clientCa,
    rejectUnauthorized: false,
  })

  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async getAllPoliceCaseFiles(caseId: string): Promise<PoliceCaseFile[]> {
    let res: Response
    try {
      res = await fetch(
        `${this.xRoadPath}/api/Rettarvarsla/GetDocumentListById/${caseId}`,
        {
          headers: { 'X-Road-Client': environment.xRoad.clientId },
          agent: this.agent,
        } as RequestInit,
      )
    } catch (error) {
      this.logger.error(
        `Failed to get police case files for case ${caseId}`,
        error,
      )

      throw new BadGatewayException(
        `Failed to get police case files for case ${caseId}`,
      )
    }

    if (!res.ok) {
      this.logger.info(`Failed to get police case files for case ${caseId}`)

      throw new NotFoundException(
        `Failed to get police case files for case ${caseId}`,
      )
    }

    const files = await res.json()

    return files.map(
      (file: { rvMalSkjolMals_ID: string; heitiSkjals: string }) => ({
        id: file.rvMalSkjolMals_ID,
        name: file.heitiSkjals,
      }),
    )
  }
}
