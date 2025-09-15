import { Agent } from 'https'
import fetch from 'isomorphic-fetch'
import { Base64 } from 'js-base64'
import { uuid } from 'uuidv4'
import { z } from 'zod'

import {
  BadGatewayException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'
import {
  createXRoadAPIPath,
  XRoadMemberClass,
} from '@island.is/shared/utils/server'

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import type {
  SubpoenaPoliceDocumentInfo,
  User,
  VerdictPoliceDocumentInfo,
} from '@island.is/judicial-system/types'
import {
  CaseState,
  CaseType,
  mapPoliceVerdictDeliveryStatus,
  PoliceFileTypeCode,
  ServiceStatus,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import { AwsS3Service } from '../aws-s3'
import { EventService } from '../event'
import { Case, DateLog, Defendant } from '../repository'
import { UploadPoliceCaseFileDto } from './dto/uploadPoliceCaseFile.dto'
import { CreateSubpoenaResponse } from './models/createSubpoena.response'
import { PoliceCaseFile } from './models/policeCaseFile.model'
import { PoliceCaseInfo } from './models/policeCaseInfo.model'
import { UploadPoliceCaseFileResponse } from './models/uploadPoliceCaseFile.response'
import { policeModuleConfig } from './police.config'

export enum PoliceDocumentType {
  RVKR = 'RVKR', // Krafa
  RVTB = 'RVTB', // Þingbók
  RVUR = 'RVUR', // Úrskurður
  RVVI = 'RVVI', // Vistunarseðill
  RVUL = 'RVUL', // Úrskurður Landsréttar
  RVDO = 'RVDO', // Dómur
  RVAS = 'RVAS', // Ákæra
  RVMG = 'RVMG', // Málsgögn
  RVMV = 'RVMV', // Viðbótargögn verjanda
  RVVS = 'RVVS', // Viðbótargögn sækjanda
  RVFK = 'RVFK', // Fyrirkall
  RVBD = 'RVBD', // Birtingarvottorð dóms - TODO: Not supported by RLS?
}

export interface PoliceDocument {
  type: PoliceDocumentType
  courtDocument: string
}

export interface SubpoenaInfo {
  serviceStatus?: ServiceStatus
  comment?: string
  servedBy?: string
  defenderNationalId?: string
  serviceDate?: Date
}

interface CreateDocumentResponse {
  externalPoliceDocumentId: string
}

const getChapter = (category?: string): number | undefined => {
  if (!category) {
    return undefined
  }

  const chapter = /^([0-9]+)\..*$/.exec(category) // Matches the first number in a string

  if (!chapter || +chapter[1] < 1) {
    return undefined
  }

  return +chapter[1] - 1
}

const formatCrimeScenePlace = (
  street?: string | null,
  streetNumber?: string | null,
  municipality?: string | null,
) => {
  if (!street && !municipality) {
    return ''
  }

  // Format the street and street number
  const formattedStreet =
    street && streetNumber ? `${street} ${streetNumber}` : street

  // Format the municipality
  const formattedMunicipality =
    municipality && street ? `, ${municipality}` : municipality

  const address = `${formattedStreet ?? ''}${formattedMunicipality ?? ''}`

  return address.trim()
}

@Injectable()
export class PoliceService {
  private xRoadPath: string
  private agent: Agent
  private throttle = Promise.resolve({} as UploadPoliceCaseFileResponse)

  private policeCaseFileType = z.object({
    kodi: z.string().nullish(),
  })
  private policeCaseFileStructure = z.object({
    rvMalSkjolMals_ID: z.number(),
    heitiSkjals: z.string(),
    malsnumer: z.string(),
    domsSkjalsFlokkun: z.optional(z.string()),
    dagsStofnad: z.optional(z.string()),
    skjalasnid: z.optional(z.string()),
    tegundSkjals: this.policeCaseFileType.nullish(),
  })
  private readonly crimeSceneStructure = z.object({
    vettvangur: z.optional(z.string()),
    brotFra: z.optional(z.string()),
    upprunalegtMalsnumer: z.string(),
    licencePlate: z.optional(z.string()),
    gotuHeiti: z.optional(z.string()),
    gotuNumer: z.string().nullish(),
    sveitafelag: z.string().nullish(),
    postnumer: z.string().nullish(),
  })
  private responseStructure = z.object({
    malsnumer: z.string(),
    skjol: z.optional(z.array(this.policeCaseFileStructure)),
    malseinings: z.optional(z.array(this.crimeSceneStructure)),
  })
  private subpoenaStructure = z.object({
    acknowledged: z.boolean().nullish(),
    comment: z.string().nullish(),
    defenderChoice: z.string().nullish(),
    defenderNationalId: z.string().nullish(),
    prosecutedConfirmedSubpoenaThroughIslandis: z.boolean().nullish(),
    servedBy: z.string().nullish(),
    servedAt: z.string().nullish(),
    delivered: z.boolean().nullish(),
    deliveredOnPaper: z.boolean().nullish(),
    deliveredToLawyer: z.boolean().nullish(),
  })

  // TODO: Template - confirm with RLS
  private documentStructure = z.object({
    comment: z.string().nullish(),
    servedBy: z.string().nullish(),
    servedAt: z.string().nullish(),
    delivered: z.boolean().nullish(),
    deliveredOnPaper: z.boolean().nullish(),
    deliveredToLawyer: z.boolean().nullish(),
    deliveredOnIslandis: z.boolean().nullish(),
    defenderNationalId: z.string().nullish(),
  })

  constructor(
    @Inject(policeModuleConfig.KEY)
    private readonly config: ConfigType<typeof policeModuleConfig>,
    @Inject(forwardRef(() => EventService))
    private readonly eventService: EventService,
    @Inject(forwardRef(() => AwsS3Service))
    private readonly awsS3Service: AwsS3Service,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    this.xRoadPath = createXRoadAPIPath(
      config.tlsBasePathWithEnv,
      XRoadMemberClass.GovernmentInstitution,
      config.policeMemberCode,
      config.policeApiPath,
    )
    this.agent = new Agent({
      cert: config.clientCert,
      key: config.clientKey,
      ca: config.clientPem,
      rejectUnauthorized: false,
    })
  }

  private async fetchPoliceDocumentApi(url: string): Promise<Response> {
    if (!this.config.policeCaseApiAvailable) {
      throw new ServiceUnavailableException('Police document API not available')
    }

    return fetch(url, {
      headers: {
        'X-Road-Client': this.config.clientId,
        'X-API-KEY': this.config.policeApiKey,
      },
      agent: this.agent,
    } as RequestInit)
  }

  private async fetchPoliceCaseApi(
    url: string,
    requestInit: RequestInit,
  ): Promise<Response> {
    if (!this.config.policeCaseApiAvailable) {
      throw new ServiceUnavailableException('Police case API not available')
    }

    return fetch(url, requestInit)
  }

  private async throttleUploadPoliceCaseFile(
    caseId: string,
    caseType: CaseType,
    uploadPoliceCaseFile: UploadPoliceCaseFileDto,
    user: User,
  ): Promise<UploadPoliceCaseFileResponse> {
    await this.throttle.catch((reason) => {
      this.logger.info('Previous upload failed', { reason })
    })

    const pdf = await this.fetchPoliceDocumentApi(
      `${this.xRoadPath}/V2/GetPDFDocumentByID/${uploadPoliceCaseFile.id}`,
    )
      .then(async (res) => {
        if (res.ok) {
          const response = await res.json()

          return Base64.atob(response)
        }

        const reason = await res.text()

        throw new NotFoundException({
          message: `Police case file ${uploadPoliceCaseFile.id} of case ${caseId} not found`,
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
            message: `Police case file ${uploadPoliceCaseFile.id} of case ${caseId} not found`,
            detail: reason.message,
          })
        }

        this.eventService.postErrorEvent(
          'Failed to get police case file',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
            caseFileId: uploadPoliceCaseFile.id,
            name: uploadPoliceCaseFile.name,
          },
          reason,
        )

        throw new BadGatewayException({
          ...reason,
          message: `Failed to get police case file ${uploadPoliceCaseFile.id} of case ${caseId}`,
          detail: reason.message,
        })
      })

    const key = `${caseId}/${uuid()}/${uploadPoliceCaseFile.name}`

    await this.awsS3Service.putObject(caseType, key, pdf)

    return { key, size: pdf.length }
  }

  async getAllPoliceCaseFiles(
    caseId: string,
    user: User,
  ): Promise<PoliceCaseFile[]> {
    const startTime = nowFactory()

    return this.fetchPoliceDocumentApi(
      `${this.xRoadPath}/V2/GetDocumentListById/${caseId}`,
    )
      .then(async (res: Response) => {
        if (res.ok) {
          const response: z.infer<typeof this.responseStructure> =
            await res.json()

          this.responseStructure.parse(response)

          const files: PoliceCaseFile[] = []

          response.skjol?.forEach((file) => {
            const id = file.rvMalSkjolMals_ID.toString()
            if (!files.find((item) => item.id === id)) {
              files.push({
                id,
                name: `${file.heitiSkjals}${file.skjalasnid ?? '.pdf'}`,
                policeCaseNumber: file.malsnumer,
                chapter: getChapter(file.domsSkjalsFlokkun),
                displayDate: file.dagsStofnad,
                type: file.tegundSkjals?.kodi ?? undefined,
              })
            }
          })

          return files
        }

        const reason = await res.text()

        // The police system does not provide a structured error response.
        // When a police case does not exist, a stack trace is returned.
        throw new NotFoundException({
          message: `Police case for case ${caseId} does not exist`,
          detail: reason,
        })
      })
      .catch((reason) => {
        if (reason instanceof NotFoundException) {
          throw reason
        }

        if (reason instanceof ServiceUnavailableException) {
          // Act as if the case does not exist
          throw new NotFoundException({
            ...reason,
            message: `Police case for case ${caseId} does not exist`,
            detail: reason.message,
          })
        }

        this.eventService.postErrorEvent(
          'Failed to get police case files',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
            startTime,
            endTime: nowFactory(),
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

  async getSubpoenaStatus(
    policeSubpoenaId: string,
    user?: User,
  ): Promise<SubpoenaPoliceDocumentInfo> {
    return this.fetchPoliceDocumentApi(
      `${this.xRoadPath}/GetSubpoenaStatus?id=${policeSubpoenaId}`,
    )
      .then(async (res: Response) => {
        if (res.ok) {
          const response: z.infer<typeof this.subpoenaStructure> =
            await res.json()

          this.subpoenaStructure.parse(response)

          return {
            serviceStatus: response.deliveredToLawyer
              ? ServiceStatus.DEFENDER
              : response.prosecutedConfirmedSubpoenaThroughIslandis
              ? ServiceStatus.ELECTRONICALLY
              : response.deliveredOnPaper || response.delivered === true
              ? ServiceStatus.IN_PERSON
              : response.acknowledged === false && response.delivered === false
              ? ServiceStatus.FAILED
              : // TODO: handle expired
                undefined,
            comment: response.comment ?? undefined,
            servedBy: response.servedBy ?? undefined,
            defenderNationalId: response.defenderNationalId ?? undefined,
            serviceDate: response.servedAt
              ? new Date(response.servedAt)
              : undefined,
          }
        }

        const reason = await res.text()

        // The police system does not provide a structured error response.
        // When a subpoena does not exist, a stack trace is returned.
        throw new NotFoundException({
          message: `Subpoena with police subpoena id ${policeSubpoenaId} does not exist`,
          detail: reason,
        })
      })
      .catch((reason) => {
        if (reason instanceof NotFoundException) {
          throw reason
        }

        if (reason instanceof ServiceUnavailableException) {
          // Act as if the subpoena does not exist
          throw new NotFoundException({
            ...reason,
            message: `Subpoena ${policeSubpoenaId} does not exist`,
            detail: reason.message,
          })
        }

        this.eventService.postErrorEvent(
          'Failed to get subpoena',
          {
            policeSubpoenaId,
            actor: user?.name || 'Digital-mailbox',
            institution: user?.institution?.name,
          },
          reason,
        )

        throw new BadGatewayException({
          ...reason,
          message: `Failed to get subpoena ${policeSubpoenaId}`,
          detail: reason.message,
        })
      })
  }

  async getPoliceCaseInfo(
    caseId: string,
    user: User,
  ): Promise<PoliceCaseInfo[]> {
    return this.fetchPoliceDocumentApi(
      `${this.xRoadPath}/V2/GetDocumentListById/${caseId}`,
    )
      .then(async (res: Response) => {
        if (res.ok) {
          const response: z.infer<typeof this.responseStructure> =
            await res.json()

          this.responseStructure.parse(response)

          const cases: PoliceCaseInfo[] = [
            { policeCaseNumber: response.malsnumer },
          ]

          response.skjol?.forEach((info: { malsnumer: string }) => {
            if (
              !cases.find((item) => item.policeCaseNumber === info.malsnumer)
            ) {
              cases.push({ policeCaseNumber: info.malsnumer })
            }
          })

          response.malseinings?.forEach(
            (info: {
              upprunalegtMalsnumer: string
              vettvangur?: string
              brotFra?: string
              licencePlate?: string
              gotuHeiti?: string | null
              gotuNumer?: string | null
              sveitafelag?: string | null
            }) => {
              const policeCaseNumber = info.upprunalegtMalsnumer

              const place = formatCrimeScenePlace(
                info.gotuHeiti,
                info.gotuNumer,
                info.sveitafelag,
              )
              const date = info.brotFra ? new Date(info.brotFra) : undefined
              const licencePlate = info.licencePlate

              const foundCase = cases.find(
                (item) => item.policeCaseNumber === policeCaseNumber,
              )

              if (!foundCase) {
                cases.push({ policeCaseNumber, place, date, licencePlate })
              } else if (date && (!foundCase.date || date > foundCase.date)) {
                foundCase.place = place
                foundCase.date = date
                foundCase.licencePlate = licencePlate
              }
            },
          )

          return cases
        }

        const reason = await res.text()

        // The police system does not provide a structured error response.
        // When a police case does not exist, a stack trace is returned.
        throw new NotFoundException({
          message: `Police case info for case ${caseId} does not exist`,
          detail: reason,
        })
      })
      .catch((reason) => {
        if (reason instanceof NotFoundException) {
          throw reason
        }

        if (reason instanceof ServiceUnavailableException) {
          // Act as if the case does not exist
          throw new NotFoundException({
            ...reason,
            message: `Police case info for case ${caseId} does not exist`,
            detail: reason.message,
          })
        }

        this.eventService.postErrorEvent(
          'Failed to get police case info',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
          },
          reason,
        )

        throw new BadGatewayException({
          ...reason,
          message: `Failed to get police case info for case ${caseId}`,
          detail: reason.message,
        })
      })
  }

  async uploadPoliceCaseFile(
    caseId: string,
    caseType: CaseType,
    uploadPoliceCaseFile: UploadPoliceCaseFileDto,
    user: User,
  ): Promise<UploadPoliceCaseFileResponse> {
    this.throttle = this.throttleUploadPoliceCaseFile(
      caseId,
      caseType,
      uploadPoliceCaseFile,
      user,
    )

    return this.throttle
  }

  async updatePoliceCase(
    user: User,
    caseId: string,
    caseType: CaseType,
    caseState: CaseState,
    policeCaseNumber: string,
    courtCaseNumber: string,
    defendantNationalId: string,
    validToDate: Date,
    caseConclusion: string,
    courtDocuments: PoliceDocument[],
  ): Promise<boolean> {
    return this.fetchPoliceCaseApi(
      `${this.xRoadPath}/V2/UpdateRVCase/${caseId}`,
      {
        method: 'PUT',
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
          'X-Road-Client': this.config.clientId,
          'X-API-KEY': this.config.policeApiKey,
        },
        agent: this.agent,
        body: JSON.stringify({
          rvMal_ID: caseId,
          caseNumber: policeCaseNumber,
          courtCaseNumber,
          ssn: defendantNationalId,
          type: caseType,
          courtVerdict: caseState,
          expiringDate: validToDate?.toISOString(),
          courtVerdictString: caseConclusion,
          courtDocuments,
        }),
      } as RequestInit,
    )
      .then(async (res) => {
        if (res.ok) {
          return true
        }

        const response = await res.text()

        throw response
      })
      .catch((reason) => {
        if (reason instanceof ServiceUnavailableException) {
          // Do not spam the logs with errors
          // Act as if the case was updated
          return true
        }

        this.logger.error(`Failed to update police case ${caseId}`, {
          reason,
        })

        this.eventService.postErrorEvent(
          'Failed to update police case',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
            caseType,
            caseState,
            policeCaseNumber,
            courtCaseNumber,
          },
          reason,
        )

        return false
      })
  }

  async createDocument({
    caseId,
    defendantId,
    user,
    documentName,
    documentFiles,
    documentDates,
    fileTypeCode,
    caseSupplements,
  }: {
    caseId: string
    defendantId: string
    user: User
    documentName: string
    documentFiles: { name: string; documentBase64: string }[]
    documentDates: { code: string; value: Date }[]
    fileTypeCode: string
    caseSupplements: { code: string; value: string }[]
  }): Promise<CreateDocumentResponse | undefined> {
    const { name: actor } = user

    const createDocumentPath = `${this.xRoadPath}/CreateDocument`

    try {
      const res = await this.fetchPoliceCaseApi(createDocumentPath, {
        method: 'POST',
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
          'X-Road-Client': this.config.clientId,
          'X-API-KEY': this.config.policeApiKey,
        },
        agent: this.agent,
        body: JSON.stringify({
          documentName: documentName,
          documentFiles,
          fileTypeCode,
          supplements: caseSupplements,
          dates: documentDates,
        }),
      } as RequestInit)

      if (res.ok) {
        const policeResponse = await res.json()
        return { externalPoliceDocumentId: policeResponse.id }
      }
    } catch (error) {
      this.logger.error(
        `${createDocumentPath} - create external police document for file type code ${fileTypeCode} for case ${caseId}`,
        {
          error,
        },
      )

      this.eventService.postErrorEvent(
        'Failed to create external police document file',
        {
          caseId,
          defendantId,
          actor,
        },
        error,
      )

      throw error
    }
  }

  async getVerdictDocumentStatus(
    policeDocumentId: string,
    user?: User,
  ): Promise<VerdictPoliceDocumentInfo> {
    return this.fetchPoliceDocumentApi(
      `${this.xRoadPath}/GetDocumentStatus?id=${policeDocumentId}`,
    )
      .then(async (res: Response) => {
        if (res.ok) {
          const response: z.infer<typeof this.documentStructure> =
            await res.json()
          this.documentStructure.parse(response)

          const servedAt =
            response.servedAt && !Number.isNaN(Date.parse(response.servedAt))
              ? new Date(response.servedAt)
              : undefined

          return {
            serviceStatus: mapPoliceVerdictDeliveryStatus({
              delivered: response.delivered ?? false,
              deliveredOnPaper: response.deliveredOnPaper ?? false,
              deliveredOnIslandis: response.deliveredOnIslandis ?? false,
              deliveredToLawyer: response.deliveredToLawyer ?? false,
            }),
            comment: response.comment ?? undefined,
            servedBy: response.servedBy ?? undefined,
            serviceDate: servedAt,
            defenderNationalId: response.defenderNationalId ?? undefined,
          }
        }
        const reason = await res.text()

        // The police system does not provide a structured error response.
        // When a document does not exist, a stack trace is returned.
        throw new NotFoundException({
          message: `Document with police document id ${policeDocumentId} does not exist`,
          detail: reason,
        })
      })
      .catch((reason) => {
        if (reason instanceof NotFoundException) {
          throw reason
        }

        if (reason instanceof ServiceUnavailableException) {
          // Act as if the document does not exist
          throw new NotFoundException({
            ...reason,
            message: `Police document ${policeDocumentId} does not exist`,
            detail: reason.message,
          })
        }

        this.eventService.postErrorEvent(
          'Failed to get police document status',
          {
            policeDocumentId,
            actor: user?.name || 'Digital-mailbox',
            institution: user?.institution?.name,
          },
          reason,
        )

        throw new BadGatewayException({
          message: `Failed to get police document status ${policeDocumentId}`,
          detail:
            reason instanceof Error
              ? reason.message
              : typeof reason === 'string'
              ? reason
              : JSON.stringify(reason),
        })
      })
  }

  async createSubpoena(
    theCase: Case,
    defendant: Defendant,
    subpoena: string,
    indictment: string,
    user: User,
    civilClaims: string[],
  ): Promise<CreateSubpoenaResponse> {
    const { courtCaseNumber, dateLogs, prosecutor, policeCaseNumbers, court } =
      theCase
    const { nationalId: defendantNationalId } = defendant
    const { name: actor } = user

    const normalizedNationalId =
      normalizeAndFormatNationalId(defendantNationalId)[0]

    const documentName = `Fyrirkall í máli ${theCase.courtCaseNumber}`
    const arraignmentInfo = DateLog.arraignmentDate(dateLogs)

    try {
      const res = await this.fetchPoliceCaseApi(
        `${this.xRoadPath}/CreateSubpoena`,
        {
          method: 'POST',
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
            'X-Road-Client': this.config.clientId,
            'X-API-KEY': this.config.policeApiKey,
          },
          agent: this.agent,
          body: JSON.stringify({
            documentName: documentName,
            documentsBase64: [subpoena, indictment, ...civilClaims],
            courtRegistrationDate: arraignmentInfo?.date,
            prosecutorSsn: prosecutor?.nationalId,
            prosecutedSsn: normalizedNationalId,
            courtAddress: court?.address,
            courtRoomNumber: arraignmentInfo?.location || '',
            courtCeremony: 'Þingfesting',
            lokeCaseNumber: policeCaseNumbers?.[0],
            courtCaseNumber: courtCaseNumber,
            fileTypeCode: PoliceFileTypeCode.SUBPOENA,
            rvgCaseId: theCase.id,
          }),
        } as RequestInit,
      )

      if (res.ok) {
        const subpoenaResponse = await res.json()
        return { policeSubpoenaId: subpoenaResponse.id }
      }

      throw await res.text()
    } catch (error) {
      this.logger.error(`Failed create subpoena for case ${theCase.id}`, {
        error,
      })

      this.eventService.postErrorEvent(
        'Failed to create subpoena',
        {
          caseId: theCase.id,
          defendantId: defendant?.id,
          actor,
        },
        error,
      )

      throw error
    }
  }

  async revokeSubpoena(
    theCase: Case,
    policeSubpoenaId: string,
    user: User,
  ): Promise<boolean> {
    const { name: actor } = user

    try {
      const res = await this.fetchPoliceCaseApi(
        `${this.xRoadPath}/InvalidateCourtSummon?sekGuid=${policeSubpoenaId}`,
        {
          method: 'POST',
          headers: {
            accept: '*/*',
            'X-Road-Client': this.config.clientId,
            'X-API-KEY': this.config.policeApiKey,
          },
          agent: this.agent,
        } as RequestInit,
      )

      if (res.ok) {
        return true
      }

      throw await res.text()
    } catch (error) {
      this.logger.error(
        `Failed revoke subpoena with police subpoena id ${policeSubpoenaId} for case ${theCase.id} from police`,
        {
          error,
        },
      )

      this.eventService.postErrorEvent(
        'Failed to revoke subpoena from police',
        {
          caseId: theCase.id,
          policeSubpoenaId,
          actor,
        },
        error,
      )

      return false
    }
  }
}
