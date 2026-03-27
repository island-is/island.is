import { Agent } from 'https'
import fetch from 'isomorphic-fetch'
import { Base64 } from 'js-base64'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

import {
  BadGatewayException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

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
  getServiceDateFromSupplements,
  IndictmentCaseSubtypes,
  mapPoliceVerdictDeliveryStatus,
  PoliceFileTypeCode,
  ServiceStatus,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import { AwsS3Service } from '../aws-s3'
import { EventService } from '../event'
import { Case, DateLog, Defendant, IndictmentSubtype } from '../repository'
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
    @InjectModel(IndictmentSubtype)
    private readonly indictmentSubtypeModel: typeof IndictmentSubtype,
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

      this.eventService.postErrorEvent(
        'Failed to get police case files',
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
    if (!this.config.policeDigitalCaseFilesApiAvailable) {
      return undefined
    }

    const startTime = nowFactory()

    try {
      const res = await this.fetchPoliceDocumentApi(
        `${this.xRoadPath}/V4/GetRVRafraengogn/${caseId}`,
      )

      if (res.ok) {
        const response: z.infer<typeof this.digitalCaseFilesStructure> =
          await res.json()

        this.digitalCaseFilesStructure.parse(response)

        return response
      }

      return undefined
      // TODO - fix when RLS has adjusted this endpoint to return an empty array for a case that exists but has no files
      // const reason = await res.text()

      // The police system does not provide a structured error response.
      // When a police case does not exist, a stack trace is returned.
      // throw new NotFoundException({
      //   message: `Police case for case ${caseId} does not exist`,
      //   detail: reason,
      // })
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

      this.eventService.postErrorEvent(
        'Failed to get police digital case files',
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
        message: `Failed to get police digital case files for case ${caseId}`,
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
          name: file.externalVendorFileName,
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

      this.eventService.postErrorEvent(
        'Failed to get police defendants',
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

    this.eventService.postErrorEvent(
      'Failed to get police case units (GetRVMalseiningar)',
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
    nationalIds: string[] = [],
  ): Promise<PoliceCaseInfo[]> {
    try {
      const policeCaseResponse = await this.getPoliceCaseFiles(
        caseId,
        user,
        'getPoliceCaseInfo',
      )

      const policeDigitalCaseFilesResponse = await this.getDigitalCaseFiles(
        caseId,
        user,
        'getPoliceCaseInfo',
      )

      const caseNationalIds = Array.from(
        new Set(
          nationalIds
            .map((nationalId) => nationalId?.trim())
            .filter((nationalId) => Boolean(nationalId)),
        ),
      )
      const nationalIdsToUse =
        caseNationalIds.length > 0
          ? caseNationalIds
          : (await this.getDefendantsFromPolice(caseId, user)).map(
              (defendant) => defendant.nationalId,
            )

      const caseUnitsByDefendant = await this.getCaseUnits(
        caseId,
        nationalIdsToUse,
        user,
      )

      const policeCaseNumbers = new Set<string>([policeCaseResponse.malsnumer])

      // fetch unique police case numbers from case files and digital case files
      policeCaseResponse.skjol?.forEach((info: { malsnumer: string }) => {
        policeCaseNumbers.add(info.malsnumer)
      })
      policeDigitalCaseFilesResponse?.forEach((info: { malsnumer: string }) => {
        policeCaseNumbers.add(info.malsnumer)
      })
      const cases: PoliceCaseInfo[] = Array.from(policeCaseNumbers).map(
        (number) => ({
          policeCaseNumber: number,
        }),
      )

      // fetch and populate essential police case information from the case units
      await Promise.all(
        caseUnitsByDefendant
          .flatMap((entry) => entry.caseUnits)
          .map(async (info: CaseUnit) => {
            const policeCaseNumber = info.upprunalegtMalsnumer
            const key = info.subtype

            const place = formatCrimeScenePlace(
              info.gotuHeiti,
              info.gotuNumer,
              info.sveitafelag,
            )
            const date = info.brotFra ? new Date(info.brotFra) : undefined
            const licencePlate = info.licencePlate ?? undefined

            const foundCase = cases.find(
              (item) => item.policeCaseNumber === policeCaseNumber,
            )

            if (!foundCase) {
              cases.push({
                policeCaseNumber,
                place,
                date,
                licencePlate,
                subtypes: key ? [key] : [],
              })
            } else {
              if (date && (!foundCase.date || date > foundCase.date)) {
                foundCase.place = place
                foundCase.date = date
                foundCase.licencePlate = licencePlate
                foundCase.subtypes = []
              }

              if (key && !foundCase.subtypes?.includes(key)) {
                foundCase.subtypes?.push(key)
              }
            }
          }),
      )

      return cases
    } catch (reason) {
      this.eventService.postErrorEvent(
        'Failed to fetch and parse police case info for case',
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
        this.logger.debug(
          `Verdict for defendant ${defendantId} with police document id ${policeResponse.id} and file type code ${fileTypeCode} delivered to national commissioners office `,
        )
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

  getSubtypeByArticle(
    article?: string | null,
  ): Promise<IndictmentSubtype | null> {
    return this.indictmentSubtypeModel.findOne({
      where: { article },
    })
  }
}
