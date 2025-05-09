import { Agent } from 'https'

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

import type { User } from '@island.is/judicial-system/types'

import { Defendant } from '../defendant'
import { EventService } from '../event'
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

  async fetchCriminalRecord({
    accessToken,
    defendant,
    user,
  }: {
    accessToken: string
    defendant: Defendant
    user: User
  }) {
    if (!this.config.dmrCriminalRecordApiPath) {
      throw new ServiceUnavailableException(
        'DMR criminal record API not available',
      )
    }
    if (defendant.noNationalId || !defendant.nationalId) {
      throw new NotFoundException({
        message: `Criminal record case file for defendant ${defendant.id} of case ${defendant.caseId} not found`,
        detail: 'Defendant is missing national id',
      })
    }

    return fetch(
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
          return { fileName: `Sakavottord_${defendant.nationalId}.pdf`, buffer }
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

      // TODO: 
      // Upload to S3 - see throttleUploadPoliceCaseFile
      // fetch the file given the police case file id from the police service
      // await this.awsS3Service.putObject(caseType, key, pdf)
      // return { key, size: pdf.length }

      // I think we need to store this file in our db and represent it as a new file
      // for each fetch triggered by the user
  }
}
