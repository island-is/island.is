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

import { environment } from '../../../environments'
import { AwsS3Service } from '../aws-s3'
import { UploadPoliceCaseFileDto } from './dto'
import { PoliceCaseFile, UploadPoliceCaseFileResponse } from './models'

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

  private throttle = Promise.resolve('')

  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  private async throttleUploadPoliceCaseFile(
    caseId: string,
    uploadPoliceCaseFile: UploadPoliceCaseFileDto,
  ) {
    this.logger.debug(
      `Waiting to upload police case file ${uploadPoliceCaseFile.id} of case ${caseId}`,
    )

    await this.throttle.catch((reason) => {
      this.logger.error('Previous upload failed', { reason })
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
        error,
      )

      throw new BadGatewayException(
        `Failed to get police case file ${uploadPoliceCaseFile.id} of case ${caseId}`,
      )
    }

    if (!res.ok) {
      throw new NotFoundException(
        `Police case file ${uploadPoliceCaseFile.id} of case ${caseId} not found`,
      )
    }

    const base64 = await res.json()
    const pdf = Base64.atob(base64)

    const key = `${caseId}/${uuid()}/${uploadPoliceCaseFile.name}`

    await this.awsS3Service.putObject(key, pdf)

    this.logger.debug(
      `Done uploading police case file ${uploadPoliceCaseFile.id} of case ${caseId}`,
    )

    return key
  }

  async getAllPoliceCaseFiles(caseId: string): Promise<PoliceCaseFile[]> {
    this.logger.debug(`Getting all police files for case ${caseId}`)

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
      throw new NotFoundException(
        `No police case files found for case ${caseId}`,
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

  async uploadPoliceCaseFile(
    caseId: string,
    uploadPoliceCaseFile: UploadPoliceCaseFileDto,
  ): Promise<UploadPoliceCaseFileResponse> {
    this.logger.debug(
      `Uploading police file ${uploadPoliceCaseFile.id} of case ${caseId} to AWS S3`,
    )

    this.throttle = this.throttleUploadPoliceCaseFile(
      caseId,
      uploadPoliceCaseFile,
    )

    const key = await this.throttle

    return { key }
  }
}
