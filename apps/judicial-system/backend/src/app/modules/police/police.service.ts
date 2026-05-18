import { Agent } from 'https'
import fetch from 'isomorphic-fetch'
import { Base64 } from 'js-base64'
import { Sequelize, Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

import {
  BadGatewayException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'
import {
  createXRoadAPIPath,
  XRoadMemberClass,
} from '@island.is/shared/utils/server'

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import {
  CaseState,
  CaseType,
  type CrimeSceneMap,
  getServiceDateFromSupplements,
  IndictmentCaseSubtypes,
  IndictmentSubtype as IndictmentSubtypeEnum,
  type IndictmentSubtypeMap,
  isIndictmentCase,
  mapPoliceVerdictDeliveryStatus,
  PoliceFileTypeCode,
  ServiceStatus,
  type SubpoenaPoliceDocumentInfo,
  type User,
  type VerdictPoliceDocumentInfo,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import { AwsS3Service } from '../aws-s3'
import { EventService } from '../event'
import { IndictmentCountService } from '../indictment-count/indictmentCount.service'
import {
  Case,
  CaseDefendantPoliceCaseNumberRepositoryService,
  CaseRepositoryService,
  DateLog,
  Defendant,
  IndictmentSubtype,
} from '../repository'
import { UploadPoliceCaseFileDto } from './dto/uploadPoliceCaseFile.dto'
import { CreateSubpoenaResponse } from './models/createSubpoena.response'
import { PoliceCaseFile } from './models/policeCaseFile.model'
import { PoliceCaseInfo } from './models/policeCaseInfo.model'
import { PoliceDefendant } from './models/policeDefendant.model'
import { PoliceSystemDigitalCaseFile } from './models/PoliceSystemDigitalCaseFile.model'
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
  RVBD = 'BRTNG_RVBD', // Birtingarvottorð dóms
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

export interface CaseUnit {
  artalNrGreinLidur?: string | null
  lysing?: string | null
  nanar?: string | null
  fin?: string | null
  grof?: string | null
  vettvangur?: string | null
  gotuHeiti?: string | null
  gotuNumer?: string | null
  sveitafelag?: string | null
  postnumer?: string | null
  brotFra?: string | null
  brotTil?: string | null
  upprunalegtMalsnumer: string
  licencePlate?: string | null
  subtype?: string
}

interface CreateDocumentResponse {
  externalPoliceDocumentId: string
}

const tokenUrlResponseStructure = z.object({ url: z.string().min(1) })

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
  private policeDigitalCaseFileStructure = z.object({
    id: z.string(),
    rvMalID: z.number(),
    fullName: z.string().nullish(),
    externalVendorFileName: z.string(),
    externalVendorID: z.string(),
    registeredAt: z.string().nullish(),
  })

  private readonly getRVMalseiningarItemSchema = z.object({
    artalNrGreinLidur: z.string().nullish(),
    lysing: z.string().nullish(),
    nanar: z.string().nullish(),
    fin: z.string().nullish(),
    grof: z.string().nullish(),
    vettvangur: z.string().nullish(),
    gotuHeiti: z.string().nullish(),
    gotuNumer: z.string().nullish(),
    sveitafelag: z.string().nullish(),
    postnumer: z.string().nullish(),
    brotFra: z.string().nullish(),
    brotTil: z.string().nullish(),
    upprunalegtMalsnumer: z.string(),
    licencePlate: z.string().nullish(),
  })
  private readonly getRVMalseiningarResponseSchema = z.array(
    this.getRVMalseiningarItemSchema,
  )

  private responseStructure = z.object({
    malsnumer: z.string(),
    skjol: z.optional(z.array(this.policeCaseFileStructure)),
  })

  private digitalCaseFilesStructure = z.array(
    z.object({
      malsnumer: z.string(),
      gogn: z.optional(z.array(this.policeDigitalCaseFileStructure)),
    }),
  )

  private buildDigitalCaseFileName(
    file: z.infer<typeof this.policeDigitalCaseFileStructure>,
    policeCaseNumber: string,
  ): string {
    return [
      policeCaseNumber.trim(),
      file.fullName?.trim(),
      file.externalVendorFileName.trim(),
    ]
      .filter((part): part is string => Boolean(part))
      .join(', ')
  }

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

  private documentStructure = z.object({
    comment: z.string().nullish(),
    servedBy: z.string().nullish(),
    servedAt: z.string().nullish(),
    delivered: z.boolean().nullish(),
    deliveredOnPaper: z.boolean().nullish(),
    deliveredToLawyer: z.boolean().nullish(),
    defenderNationalId: z.string().nullish(),
    deliveredOnIslandis: z.boolean().nullish(),
    deliveredToDefendant: z.boolean().nullish(),
    deliveryMethod: z.string().nullish(),
    supplements: z
      .array(
        z.object({
          code: z.string().nullish(),
          value: z.string().nullish(),
        }),
      )
      .nullish(),
  })

  private defendantSchema = z.object({
    accusedNationalId: z.string(),
    accusedName: z.string().nullish(),
    accusedAddress: z.string().nullish(),
    accusedGender: z.string().nullish(),
    accusedDOB: z.string().nullish(),
    citizenship: z.string().nullish(),
  })
  private defendantsResponseSchema = z.array(this.defendantSchema)

  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(IndictmentSubtype)
    private readonly indictmentSubtypeModel: typeof IndictmentSubtype,
    @Inject(policeModuleConfig.KEY)
    private readonly config: ConfigType<typeof policeModuleConfig>,
    @Inject(forwardRef(() => EventService))
    private readonly eventService: EventService,
    @Inject(forwardRef(() => AwsS3Service))
    private readonly awsS3Service: AwsS3Service,
    @Inject(forwardRef(() => CaseDefendantPoliceCaseNumberRepositoryService))
    private readonly caseDefendantPoliceCaseNumberRepositoryService: CaseDefendantPoliceCaseNumberRepositoryService,
    @Inject(forwardRef(() => CaseRepositoryService))
    private readonly caseRepositoryService: CaseRepositoryService,
    @Inject(forwardRef(() => IndictmentCountService))
    private readonly indictmentCountService: IndictmentCountService,
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

  private reasonToError(reason: unknown): Error {
    if (reason instanceof Error) {
      return reason
    }
    if (typeof reason === 'string') {
      return new Error(reason)
    }
    try {
      return new Error(JSON.stringify(reason))
    } catch {
      return new Error('Unknown error')
    }
  }

  /** Winston error log plus Slack error webhook (same payload shape as before). */
  private logPoliceFailureAndNotify(
    slackTitle: string,
    logMessage: string,
    info: { [key: string]: string | boolean | Date | undefined },
    reason: unknown,
  ): void {
    const errorForSlack = this.reasonToError(reason)
    this.logger.error(logMessage, {
      ...info,
      error: reason instanceof Error ? reason : undefined,
      errorSummary:
        reason instanceof Error ? undefined : String(reason).slice(0, 2000),
    })
    void this.eventService.postErrorEvent(slackTitle, info, errorForSlack)
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

        this.logPoliceFailureAndNotify(
          'Failed to get police case file',
          `Failed to get police case file ${uploadPoliceCaseFile.id} of case ${caseId}`,
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

  private async getPoliceCaseFiles(caseId: string, user: User, source: string) {
    const startTime = nowFactory()

    try {
      const res = await this.fetchPoliceDocumentApi(
        `${this.xRoadPath}/V2/GetDocumentListById/${caseId}`,
      )

      if (res.ok) {
        const response: z.infer<typeof this.responseStructure> =
          await res.json()
        this.responseStructure.parse(response)
        return response
      }

      const reason = await res.text()

      // The police system does not provide a structured error response.
      // When a police case does not exist, a stack trace is returned.
      throw new NotFoundException({
        message: `Police case for case ${caseId} does not exist`,
        detail: reason,
      })
    } catch (reason) {
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

      this.logPoliceFailureAndNotify(
        'Failed to get police case files',
        `Failed to get police case files for case ${caseId}`,
        {
          caseId,
          actor: user.name,
          institution: user.institution?.name,
          startTime,
          endTime: nowFactory(),
          source,
        },
        reason,
      )

      throw new BadGatewayException({
        ...reason,
        message: `Failed to get police case files for case ${caseId}`,
        detail: reason.message,
      })
    }
  }

  private async getDigitalCaseFiles(
    caseId: string,
    user: User,
    source: string,
  ) {
    const startTime = nowFactory()
    const url = `${this.xRoadPath}/V4/GetRVRafraengogn/${caseId}`

    try {
      const res = await this.fetchPoliceDocumentApi(url)

      if (!res.ok) {
        const detail = await res.text()
        this.logger.error(
          `Police digital case files request returned error for case ${caseId}`,
          {
            caseId,
            source,
            status: res.status,
            detail: detail.slice(0, 2000),
          },
        )
        // The police system does not provide a structured error response.
        // When a police case does not exist, a stack trace is often returned.
        throw new NotFoundException({
          message: `Police digital case files for case ${caseId} do not exist`,
          detail,
        })
      }

      const response: z.infer<typeof this.digitalCaseFilesStructure> =
        await res.json()

      return this.digitalCaseFilesStructure.parse(response)
    } catch (reason) {
      if (reason instanceof NotFoundException) {
        throw reason
      }

      if (reason instanceof ServiceUnavailableException) {
        throw new NotFoundException({
          ...reason,
          message: `Police digital case files for case ${caseId} are unavailable`,
          detail: reason.message,
        })
      }

      this.logPoliceFailureAndNotify(
        'Failed to get police digital case files',
        `Failed to get police digital case files for case ${caseId}`,
        {
          caseId,
          actor: user.name,
          institution: user.institution?.name,
          startTime,
          endTime: nowFactory(),
          source,
        },
        reason,
      )

      throw new BadGatewayException({
        ...(reason instanceof Error ? reason : {}),
        message: `Failed to get police digital case files for case ${caseId}`,
        detail:
          reason instanceof Error ? reason.message : JSON.stringify(reason),
      })
    }
  }

  async getTokenUrl(
    rvgCaseId: string,
    userParam: string,
    policeDigitalFileId: string,
    user: User,
    source: string,
  ): Promise<string> {
    const startTime = nowFactory()
    const query = new URLSearchParams({
      rvgCaseId,
      user: userParam,
      rafraennGagnId: policeDigitalFileId,
    }).toString()
    const url = `${this.xRoadPath}/V4/GetTokenUrl?${query}`
    const httpStatusTooEarly = 425

    try {
      const res = await this.fetchPoliceDocumentApi(url)

      if (res.ok) {
        const json = await res.json()
        const parsed = tokenUrlResponseStructure.safeParse(json)
        if (parsed.success) {
          return parsed.data.url
        }
        throw new NotFoundException({
          message: `Token URL for digital case file ${policeDigitalFileId} not found`,
          detail: 'Invalid response format',
        })
      }

      if (res.status === httpStatusTooEarly) {
        throw new HttpException(
          {
            error: 'PoliceDigitalFileNotPublished',
            message:
              'The police secure digital case file area is not ready yet. Please try again later.',
          },
          httpStatusTooEarly,
        )
      }

      const reason = await res.text()

      throw new NotFoundException({
        message: `Token URL for digital case file ${policeDigitalFileId} not found`,
        detail: reason,
      })
    } catch (reason) {
      if (reason instanceof NotFoundException) {
        throw reason
      }

      if (
        reason instanceof HttpException &&
        reason.getStatus() === httpStatusTooEarly
      ) {
        throw reason
      }

      if (reason instanceof ServiceUnavailableException) {
        throw new NotFoundException({
          ...reason,
          message: `Token URL for digital case file ${policeDigitalFileId} not found`,
          detail: reason.message,
        })
      }

      this.logPoliceFailureAndNotify(
        'Failed to get token URL for digital case file',
        `Failed to get token URL for digital case file ${policeDigitalFileId}`,
        {
          rvgCaseId,
          rafraennGagnId: policeDigitalFileId,
          actor: user.name,
          institution: user.institution?.name,
          startTime,
          endTime: nowFactory(),
          source,
        },
        reason,
      )

      throw new BadGatewayException({
        ...reason,
        message: `Failed to get token URL for digital case file ${policeDigitalFileId}`,
        detail: reason.message,
      })
    }
  }

  async getAllPoliceCaseFiles(
    caseId: string,
    user: User,
  ): Promise<PoliceCaseFile[]> {
    const caseFiles = await this.getPoliceCaseFiles(
      caseId,
      user,
      'getAllPoliceCaseFiles',
    )

    const files: PoliceCaseFile[] = []

    caseFiles?.skjol?.forEach((file) => {
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

  async getAllPoliceSystemDigitalCaseFiles(
    caseId: string,
    user: User,
  ): Promise<PoliceSystemDigitalCaseFile[]> {
    const caseFiles = await this.getDigitalCaseFiles(
      caseId,
      user,
      'getAllPoliceSystemDigitalCaseFiles',
    )

    const files: PoliceSystemDigitalCaseFile[] = []

    caseFiles?.forEach((filesPerCaseNumber) => {
      filesPerCaseNumber.gogn?.forEach((file) => {
        files.push({
          id: file.id.toString(),
          name: this.buildDigitalCaseFileName(
            file,
            filesPerCaseNumber.malsnumer,
          ),
          policeCaseNumber: filesPerCaseNumber.malsnumer,
          policeExternalVendorId: file.externalVendorID,
          displayDate: file.registeredAt
            ? new Date(file.registeredAt)
            : undefined,
        })
      })
    })

    return files
  }

  async getDefendantsFromPolice(
    caseId: string,
    user: User,
  ): Promise<PoliceDefendant[]> {
    const startTime = nowFactory()
    try {
      const res = await this.fetchPoliceDocumentApi(
        `${this.xRoadPath}/V4/GetRVAdilarMals/${caseId}`,
      )

      if (!res.ok) {
        const reason = await res.text()
        throw new NotFoundException({
          message: `Police defendants for case ${caseId} do not exist`,
          detail: reason,
        })
      }

      const response: z.infer<typeof this.defendantsResponseSchema> =
        await res.json()

      this.defendantsResponseSchema.parse(response)

      return response.map((defendant) => ({
        nationalId: defendant.accusedNationalId,
        name: defendant.accusedName ?? undefined,
        gender: defendant.accusedGender ?? undefined,
        address: defendant.accusedAddress ?? undefined,
        dateOfBirth: defendant.accusedDOB ?? undefined,
        citizenship: defendant.citizenship ?? undefined,
      }))
    } catch (reason) {
      if (reason instanceof NotFoundException) {
        throw reason
      }

      if (reason instanceof ServiceUnavailableException) {
        throw new NotFoundException({
          ...reason,
          message: `Police defendants for case ${caseId} do not exist`,
          detail: reason.message,
        })
      }

      this.logPoliceFailureAndNotify(
        'Failed to get police defendants',
        `Failed to get police defendants for case ${caseId}`,
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
        message: `Failed to get police defendants for case ${caseId}`,
        detail: reason.message,
      })
    }
  }

  private async getCaseUnitsForNationalId(
    caseId: string,
    nationalId: string,
  ): Promise<{ nationalId: string; caseUnits: CaseUnit[] }> {
    const res = await this.fetchPoliceDocumentApi(
      `${this.xRoadPath}/V4/GetRVMalseiningar/${caseId}/${nationalId}`,
    )

    if (!res.ok) {
      const reason = await res.text()
      throw new NotFoundException({
        message: `Police case units for case ${caseId} and nationalId do not exist`,
        detail: reason,
      })
    }

    const responseJson = await res.json()
    const parsedCaseUnits =
      this.getRVMalseiningarResponseSchema.parse(responseJson)
    const caseUnits = await Promise.all(
      parsedCaseUnits.map(async (unit) => {
        const subtype = await this.getSubtypeByArticle(unit.artalNrGreinLidur)
        const key = Object.keys(IndictmentCaseSubtypes).find(
          (k) =>
            IndictmentCaseSubtypes[k as keyof typeof IndictmentCaseSubtypes] ===
            subtype?.offenseType,
        )

        return {
          ...unit,
          subtype: key,
        }
      }),
    )
    return { nationalId, caseUnits }
  }

  private async getCaseUnits(
    caseId: string,
    nationalIds: string[],
    user: User,
  ): Promise<Array<{ nationalId: string; caseUnits: CaseUnit[] }>> {
    const startTime = nowFactory()

    if (nationalIds.length === 0) {
      return []
    }

    // Don't fail the whole request if one nationalId fails to fetch case units
    const settled = await Promise.allSettled(
      nationalIds.map((nationalId) =>
        this.getCaseUnitsForNationalId(caseId, nationalId),
      ),
    )

    const results = settled
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)

    if (results.length > 0) {
      const failures = settled.filter((result) => result.status === 'rejected')

      if (failures.length > 0) {
        this.logger.warn(
          `Failed to fetch police case units for ${failures.length}/${nationalIds.length} nationalId(s) for case ${caseId}`,
        )
      }

      return results
    }

    // Only reached if all nationalIds are rejected
    const rejectedReasons = settled
      .filter((result) => result.status === 'rejected')
      .map((result) => result.reason)
    const hasNotFound = rejectedReasons.some(
      (reason) => reason instanceof NotFoundException,
    )
    const hasServiceUnavailable = rejectedReasons.some(
      (reason) => reason instanceof ServiceUnavailableException,
    )
    const uniqueMessages = Array.from(
      new Set(
        rejectedReasons
          .map((reason) => {
            if (reason instanceof Error) {
              return reason.message
            }

            if (typeof reason === 'string') {
              return reason
            }

            return undefined
          })
          .filter((message): message is string => Boolean(message)),
      ),
    )
    const detail =
      uniqueMessages.length > 0
        ? uniqueMessages.join(' | ')
        : 'Unknown error while fetching case units'
    const aggregatedError = new Error(detail)

    this.logPoliceFailureAndNotify(
      'Failed to get police case units (GetRVMalseiningar)',
      `Failed to get police case units (GetRVMalseiningar) for case ${caseId}`,
      {
        caseId,
        actor: user.name,
        institution: user.institution?.name,
        startTime,
        endTime: nowFactory(),
        failedNationalIds: `${nationalIds.length}`,
        failureMessages: uniqueMessages.join(' | '),
        failureReasons: rejectedReasons
          .map((reason) =>
            reason instanceof Error
              ? reason.stack ?? reason.message
              : typeof reason === 'string'
              ? reason
              : JSON.stringify(reason),
          )
          .join(' | '),
      },
      aggregatedError,
    )

    if (hasNotFound) {
      throw new NotFoundException({
        message: `Police case units for case ${caseId} do not exist`,
        detail,
      })
    }

    if (hasServiceUnavailable) {
      throw new NotFoundException({
        message: `Police case units for case ${caseId} do not exist`,
        detail,
      })
    }

    throw new BadGatewayException({
      message: `Failed to get police case units for case ${caseId}`,
      detail,
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

        this.logPoliceFailureAndNotify(
          'Failed to get subpoena',
          `Failed to get subpoena ${policeSubpoenaId}`,
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

  private buildPoliceCaseInfoFromCaseUnits(
    caseUnits: CaseUnit[],
  ): PoliceCaseInfo[] {
    const cases: PoliceCaseInfo[] = []

    for (const unit of caseUnits) {
      const policeCaseNumber = unit.upprunalegtMalsnumer
      const place = formatCrimeScenePlace(
        unit.gotuHeiti,
        unit.gotuNumer,
        unit.sveitafelag,
      )
      const date = unit.brotFra ? new Date(unit.brotFra) : undefined
      const licencePlate = unit.licencePlate ?? undefined
      const subtype = unit.subtype

      const foundCase = cases.find(
        (item) => item.policeCaseNumber === policeCaseNumber,
      )

      if (!foundCase) {
        cases.push({
          policeCaseNumber,
          place,
          date,
          licencePlate,
          subtypes: subtype ? [subtype] : [],
        })
      } else {
        const isNewer = date && (!foundCase.date || date > foundCase.date)

        if (isNewer) {
          foundCase.place = place
          foundCase.date = date
          foundCase.licencePlate = licencePlate
          foundCase.subtypes = []
        }

        const isRelevant = !foundCase.date || (date && date >= foundCase.date)

        if (subtype && isRelevant && !foundCase.subtypes?.includes(subtype)) {
          foundCase.subtypes?.push(subtype)
        }
      }
    }

    return cases
  }

  private buildDefendantPoliceCaseNumberLinks(
    defendants: { id: string; nationalId: string }[],
    caseUnitsByDefendant: { nationalId: string; caseUnits: CaseUnit[] }[],
  ): { defendantId: string; policeCaseNumber: string }[] {
    const defendantIdByNationalId = new Map(
      defendants.map((d) => [d.nationalId, d.id]),
    )

    const links: { defendantId: string; policeCaseNumber: string }[] = []

    for (const { nationalId, caseUnits } of caseUnitsByDefendant) {
      const defendantId = defendantIdByNationalId.get(nationalId)
      if (!defendantId) {
        continue
      }
      for (const unit of caseUnits) {
        if (unit.upprunalegtMalsnumer) {
          links.push({
            defendantId,
            policeCaseNumber: unit.upprunalegtMalsnumer,
          })
        }
      }
    }

    return links
  }

  private buildAutoFillUpdates(
    cases: PoliceCaseInfo[],
    policeCaseNumbers: string[],
    existingCrimeScenes?: CrimeSceneMap,
    existingSubtypes?: IndictmentSubtypeMap,
  ): { crimeScenes: CrimeSceneMap; indictmentSubtypes: IndictmentSubtypeMap } {
    const lookup = new Map(cases.map((c) => [c.policeCaseNumber, c]))
    const crimeScenes: CrimeSceneMap = {}
    const indictmentSubtypes: IndictmentSubtypeMap = {}

    for (const policeCaseNumber of policeCaseNumbers) {
      const info = lookup.get(policeCaseNumber)
      if (!info) {
        continue
      }

      const scene = existingCrimeScenes?.[policeCaseNumber]
      if (!scene?.place && !scene?.date) {
        crimeScenes[policeCaseNumber] = { place: info.place, date: info.date }
      }

      const subTypes = existingSubtypes?.[policeCaseNumber]
      if (
        (!subTypes || subTypes.length === 0) &&
        info.subtypes &&
        info.subtypes.length > 0
      ) {
        indictmentSubtypes[policeCaseNumber] =
          info.subtypes as IndictmentSubtypeEnum[]
      }
    }

    return { crimeScenes, indictmentSubtypes }
  }

  async getPoliceCaseInfo(
    caseId: string,
    user: User,
    defendants: { id: string; nationalId: string }[] = [],
    caseType?: CaseType,
  ): Promise<PoliceCaseInfo[]> {
    try {
      const nationalIdsToUse =
        defendants.length > 0
          ? defendants.map((d) => d.nationalId)
          : (await this.getDefendantsFromPolice(caseId, user)).map(
              (d) => d.nationalId,
            )

      const caseUnitsByDefendant = await this.getCaseUnits(
        caseId,
        nationalIdsToUse,
        user,
      )

      const cases = this.buildPoliceCaseInfoFromCaseUnits(
        caseUnitsByDefendant.flatMap((entry) => entry.caseUnits),
      )

      const defendantPoliceCaseNumberLinks =
        this.buildDefendantPoliceCaseNumberLinks(
          defendants,
          caseUnitsByDefendant,
        )

      if (defendantPoliceCaseNumberLinks.length > 0) {
        await this.sequelize.transaction(async (transaction: Transaction) => {
          await this.caseDefendantPoliceCaseNumberRepositoryService.assignDefendantPoliceCaseNumbers(
            caseId,
            defendantPoliceCaseNumberLinks,
            { transaction },
          )

          if (caseType && isIndictmentCase(caseType)) {
            const allLinkedPoliceCaseNumbers = [
              ...new Set(
                defendantPoliceCaseNumberLinks.map((l) => l.policeCaseNumber),
              ),
            ]

            const existingCounts =
              await this.indictmentCountService.findByCaseId(
                caseId,
                transaction,
              )
            const coveredPoliceCaseNumbers = new Set(
              existingCounts
                .map((c) => c.policeCaseNumber)
                .filter((pcn): pcn is string => !!pcn),
            )

            const missingPoliceCaseNumbers = allLinkedPoliceCaseNumbers.filter(
              (pcn) => !coveredPoliceCaseNumbers.has(pcn),
            )

            for (const policeCaseNumber of missingPoliceCaseNumbers) {
              await this.indictmentCountService.createWithPoliceCaseNumber(
                caseId,
                policeCaseNumber,
                transaction,
              )
            }

            const theCase = await this.caseRepositoryService.findById(caseId, {
              transaction,
            })

            if (theCase) {
              const fills = this.buildAutoFillUpdates(
                cases,
                allLinkedPoliceCaseNumbers,
                theCase.crimeScenes,
                theCase.indictmentSubtypes,
              )

              const updates: {
                crimeScenes?: CrimeSceneMap
                indictmentSubtypes?: IndictmentSubtypeMap
              } = {}

              if (Object.keys(fills.crimeScenes).length > 0) {
                updates.crimeScenes = {
                  ...theCase.crimeScenes,
                  ...fills.crimeScenes,
                }
              }

              if (Object.keys(fills.indictmentSubtypes).length > 0) {
                updates.indictmentSubtypes = {
                  ...theCase.indictmentSubtypes,
                  ...fills.indictmentSubtypes,
                }
              }

              if (updates.crimeScenes || updates.indictmentSubtypes) {
                await this.caseRepositoryService.update(caseId, updates, {
                  transaction,
                })
              }
            }
          }
        })
      }

      return cases
    } catch (reason) {
      this.logPoliceFailureAndNotify(
        'Failed to fetch and parse police case info for case',
        `Failed to fetch and parse police case info for case ${caseId}`,
        {
          caseId,
          actor: user.name,
          institution: user.institution?.name,
        },
        reason,
      )

      if (
        reason instanceof NotFoundException ||
        reason instanceof BadGatewayException
      ) {
        throw reason
      }
      throw new Error(
        `Failed to fetch and parse police case info for case ${caseId}`,
      )
    }
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

        this.logPoliceFailureAndNotify(
          'Failed to update police case',
          `Failed to update police case ${caseId}`,
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
            caseType: String(caseType),
            caseState: String(caseState),
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
  }): Promise<CreateDocumentResponse> {
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
        this.logger.debug(
          `Verdict for defendant ${defendantId} with police document id ${policeResponse.id} and file type code ${fileTypeCode} delivered to national commissioners office `,
        )
        return { externalPoliceDocumentId: policeResponse.id }
      }

      throw await res.text()
    } catch (error) {
      this.logPoliceFailureAndNotify(
        'Failed to create external police document file',
        `${createDocumentPath} - create external police document for file type code ${fileTypeCode} for case ${caseId}`,
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
      `${this.xRoadPath}/GetDeliveryStatus?id=${policeDocumentId}`,
    )
      .then(async (res: Response) => {
        if (res.ok) {
          const response: z.infer<typeof this.documentStructure> =
            await res.json()
          this.documentStructure.parse(response)
          const serviceStatus = mapPoliceVerdictDeliveryStatus({
            delivered: response.delivered ?? false,
            deliveredOnPaper: response.deliveredOnPaper ?? false,
            deliveredOnIslandis: response.deliveredOnIslandis ?? false,
            deliveredToLawyer: response.deliveredToLawyer ?? false,
            deliveredToDefendant: response.deliveredToDefendant ?? false,
            deliveryMethod: response.deliveryMethod ?? undefined,
          })

          const legalPaperServiceDate =
            serviceStatus === VerdictServiceStatus.LEGAL_PAPER
              ? getServiceDateFromSupplements(response.supplements ?? undefined)
              : undefined

          const servedAt =
            response.servedAt && !Number.isNaN(Date.parse(response.servedAt))
              ? new Date(response.servedAt)
              : undefined

          return {
            serviceStatus: serviceStatus,
            deliveredToDefenderNationalId:
              response.defenderNationalId ?? undefined,
            comment: response.comment ?? undefined,
            servedBy: response.servedBy ?? undefined,
            serviceDate: legalPaperServiceDate ?? servedAt,
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

        this.logPoliceFailureAndNotify(
          'Failed to get police document status',
          `Failed to get police document status ${policeDocumentId}`,
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

  async createSubpoena({
    theCase,
    defendant,
    subpoenaId,
    subpoena,
    indictment,
    user,
    civilClaims,
  }: {
    theCase: Case
    defendant: Defendant
    subpoenaId: string
    subpoena: string
    indictment: string
    user: User
    civilClaims: string[]
  }): Promise<CreateSubpoenaResponse> {
    const { courtCaseNumber, dateLogs, prosecutor, policeCaseNumbers, court } =
      theCase
    const { nationalId: defendantNationalId } = defendant
    const { name: actor } = user

    const normalizedNationalId =
      normalizeAndFormatNationalId(defendantNationalId)[0]

    const documentName = `Fyrirkall í máli ${courtCaseNumber}`
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
            rvgSubpoenaId: subpoenaId,
          }),
        } as RequestInit,
      )

      if (res.ok) {
        const subpoenaResponse = await res.json()
        return { policeSubpoenaId: subpoenaResponse.id }
      }

      throw await res.text()
    } catch (error) {
      this.logPoliceFailureAndNotify(
        'Failed to create subpoena',
        `Failed create subpoena for case ${theCase.id}`,
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
      this.logPoliceFailureAndNotify(
        'Failed to revoke subpoena from police',
        `Failed revoke subpoena with police subpoena id ${policeSubpoenaId} for case ${theCase.id} from police`,
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

  getSubtypeByArticle(
    article?: string | null,
  ): Promise<IndictmentSubtype | null> {
    return this.indictmentSubtypeModel.findOne({
      where: { article },
    })
  }
}
