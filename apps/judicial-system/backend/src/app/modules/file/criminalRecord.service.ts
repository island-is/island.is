import { Agent } from 'https'
import fetch from 'isomorphic-fetch'
import { uuid } from 'uuidv4'

import {
  BadGatewayException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'
import {
  createXRoadAPIPath,
  XRoadMemberClass,
} from '@island.is/shared/utils/server'

import { formatDate } from '@island.is/judicial-system/formatters'
import type { CaseType, User } from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import { AwsS3Service } from '../aws-s3'
import { EventService } from '../event'
import { Defendant } from '../repository'
import { UploadCriminalRecordFileResponse } from './models/uploadCriminalRecordFile.response'
import { criminalRecordModuleConfig } from './criminalRecord.config'

@Injectable()
export class CriminalRecordService {
  private xRoadPath: string
  private agent: Agent

  constructor(
    @Inject(criminalRecordModuleConfig.KEY)
    private readonly config: ConfigType<typeof criminalRecordModuleConfig>,
    @Inject(forwardRef(() => EventService))
    private readonly eventService: EventService,
    @Inject(forwardRef(() => AwsS3Service))
    private readonly awsS3Service: AwsS3Service,
  ) {
    this.xRoadPath = createXRoadAPIPath(
      config.tlsBasePathWithEnv,
      XRoadMemberClass.GovernmentInstitution,
      config.dmrMemberCode,
      config.dmrCriminalRecordApiPath,
    )
    this.agent = new Agent({
      cert: config.clientCert,
      key: config.clientKey,
      ca: config.clientPem,
      rejectUnauthorized: false,
    })
  }

  async uploadCriminalRecordFile({
    caseType,
    defendant,
    user,
    accessToken,
  }: {
    caseType: CaseType
    defendant: Defendant
    user: User
    accessToken: string
  }): Promise<UploadCriminalRecordFileResponse> {
    if (!this.config.dmrCriminalRecordApiPath) {
      throw new ServiceUnavailableException(
        'DMR criminal record API not available',
      )
    }

    if (defendant.noNationalId) {
      throw new NotFoundException({
        message: `Criminal record case file for defendant ${defendant.id} of case ${defendant.caseId} not found`,
        detail: 'Defendant is missing national id',
      })
    }

    const pdf = await fetch(
      `${this.xRoadPath}/api/v1/DigitalIceland/CriminalRecord/Official/${defendant.nationalId}`,
      {
        headers: {
          'content-type': 'application/pdf',
          'X-Road-Client': this.config.clientId,
          Authorization: `Bearer ${accessToken}`,
        },
        agent: this.agent,
      } as RequestInit,
    )
      .then(async (res) => {
        if (res.ok) {
          const contentArrayBuffer = await res.arrayBuffer()
          const buffer = Buffer.from(contentArrayBuffer)
          const currentDate = formatDate(nowFactory())

          return {
            fileName: `Sakavottord_${defendant.nationalId}_${currentDate}.pdf`,
            buffer,
          }
        }

        const reason = await res.text()

        throw new NotFoundException({
          message: `Criminal record case file for defendant ${defendant.id} of case ${defendant.caseId} not found`,
          detail: reason,
        })
      })
      .catch((reason) => {
        if (reason instanceof NotFoundException) {
          throw reason
        }

        if (reason instanceof ServiceUnavailableException) {
          // Act as if the file was not found
          throw new NotFoundException({
            ...reason,
            message: `Criminal record case file for defendant ${defendant.id} of case ${defendant.caseId} not found`,
            detail: reason.message,
          })
        }

        this.eventService.postErrorEvent(
          'Failed to get criminal record',
          {
            caseId: defendant.caseId,
            defendantId: defendant.id,
            actor: user.name,
            institution: user.institution?.name,
          },
          reason,
        )

        throw new BadGatewayException({
          ...reason,
          message: `Failed to get criminal record case file for defendant ${defendant.id} of case ${defendant.caseId}`,
          detail: reason.message,
        })
      })

    const key = `${defendant.caseId}/${uuid()}/${pdf.fileName}`
    await this.awsS3Service.putObject(caseType, key, pdf.buffer)

    return {
      name: pdf.fileName,
      key,
      size: pdf.buffer.length,
      type: 'application/pdf',
    }
  }
}
