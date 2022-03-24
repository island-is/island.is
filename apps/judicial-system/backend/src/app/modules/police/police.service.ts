import { uuid } from 'uuidv4'
import { Base64 } from 'js-base64'
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
import { User } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import { EventService } from '../event'
import { AwsS3Service } from '../aws-s3'
import { UploadPoliceCaseFileDto } from './dto/uploadPoliceCaseFile.dto'
import { PoliceCaseFile } from './models/policeCaseFile.model'
import { UploadPoliceCaseFileResponse } from './models/uploadPoliceCaseFile.response'

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

  private throttle = Promise.resolve({} as UploadPoliceCaseFileResponse)

  constructor(
    private readonly eventService: EventService,
    private readonly awsS3Service: AwsS3Service,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private async throttleUploadPoliceCaseFile(
    caseId: string,
    uploadPoliceCaseFile: UploadPoliceCaseFileDto,
  ): Promise<UploadPoliceCaseFileResponse> {
    this.logger.debug(
      `Waiting to upload police case file ${uploadPoliceCaseFile.id} of case ${caseId}`,
    )

    await this.throttle.catch((reason) => {
      this.logger.info('Previous upload failed', { reason })
    })

    this.logger.debug(
      `Starting to upload police case file ${uploadPoliceCaseFile.id} of case ${caseId}`,
    )

    let res: Response

    try {
      res = await fetch(
        `${this.xRoadPath}/api/Documents/GetPDFDocumentByID/${uploadPoliceCaseFile.id}`,
        {
          headers: { 'X-Road-Client': environment.xRoad.clientId },
          agent: this.agent,
        } as RequestInit,
      )
    } catch (error) {
      this.logger.error(
        `Failed to get police case file ${uploadPoliceCaseFile.id} of case ${caseId}`,
        { error },
      )

      throw new BadGatewayException(
        `Failed to get police case file ${uploadPoliceCaseFile.id} of case ${caseId}`,
      )
    }

    if (!res.ok) {
      this.logger.info(
        `Failed to get police case file ${uploadPoliceCaseFile.id} of case ${caseId}`,
        { res },
      )

      throw new NotFoundException(
        `Police case file ${uploadPoliceCaseFile.id} of case ${caseId} not found`,
      )
    }

    const base64 = await res.json()
    const pdf = Base64.atob(base64)

    const key = `uploads/${caseId}/${uuid()}/${uploadPoliceCaseFile.name}`

    await this.awsS3Service.putObject(key, pdf)

    this.logger.debug(
      `Done uploading police case file ${uploadPoliceCaseFile.id} of case ${caseId}`,
    )

    return { key, size: pdf.length }
  }

  async getAllPoliceCaseFiles(
    caseId: string,
    user: User,
  ): Promise<PoliceCaseFile[]> {
    return await fetch(
      `${this.xRoadPath}/api/Rettarvarsla/GetDocumentListById/${caseId}`,
      {
        headers: { 'X-Road-Client': environment.xRoad.clientId },
        agent: this.agent,
      } as RequestInit,
    )
      .then(async (res: Response) => {
        if (res.ok) {
          const response = await res.json()

          return response.map(
            (file: { rvMalSkjolMals_ID: string; heitiSkjals: string }) => ({
              id: file.rvMalSkjolMals_ID,
              name: file.heitiSkjals,
            }),
          )
        }

        const reason = await res.text()

        // The police system does not provide a structured error response.
        // When no files exist for the case, a stack trace is returned.
        throw new NotFoundException({
          message: `No police case files found for case ${caseId}`,
          detail: reason,
        })
      })
      .catch((reason) => {
        if (reason instanceof NotFoundException) {
          throw reason
        }

        this.eventService.postErrorEvent(
          'Failed to get police case files',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
          },
          reason,
        )

        throw new BadGatewayException({
          ...reason,
          message: `Failed to get police case files for case ${caseId}`,
          detail: reason.message,
        })
      })
  }

  async uploadPoliceCaseFile(
    caseId: string,
    uploadPoliceCaseFile: UploadPoliceCaseFileDto,
  ): Promise<UploadPoliceCaseFileResponse> {
    this.throttle = this.throttleUploadPoliceCaseFile(
      caseId,
      uploadPoliceCaseFile,
    )

    return this.throttle
  }
}
