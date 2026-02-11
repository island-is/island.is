import { DataSource, DataSourceConfig } from 'apollo-datasource'
import { Request } from 'express'

import { Inject, Injectable } from '@nestjs/common'

import { type ConfigType } from '@island.is/nest/config'
import { ProblemError } from '@island.is/nest/problem'

import {
  CaseTableType,
  DateType,
  Lawyer,
  LawyerType,
  mapToLawyer,
  type User,
} from '@island.is/judicial-system/types'

import {
  Case,
  RequestSignatureResponse,
  SendNotificationResponse,
  SignatureConfirmationResponse,
} from '../case'
import { CaseListEntry } from '../case-list'
import { CaseTableResponse, SearchCasesResponse } from '../case-table'
import {
  CourtDocumentResponse,
  CourtSessionResponse,
  CourtSessionString,
  DeleteCourtDocumentResponse,
  DeleteCourtSessionResponse,
} from '../court-session'
import {
  CivilClaimant,
  Defendant,
  DeleteCivilClaimantResponse,
  DeleteDefendantResponse,
} from '../defendant'
import {
  CaseFile,
  DeleteFileResponse,
  PresignedPost,
  SignedUrl,
  UpdateFilesResponse,
  UploadCriminalRecordFileResponse,
  UploadFileToCourtResponse,
} from '../file'
import { DeleteResponse, IndictmentCount, Offense } from '../indictment-count'
import { Institution } from '../institution'
import {
  PoliceCaseFile,
  PoliceCaseInfo,
  UploadPoliceCaseFileResponse,
} from '../police'
import { CaseStatistics } from '../statistics'
import {
  CaseDataExportInput,
  IndictmentCaseStatistics,
  IndictmentStatisticsInput,
  RequestCaseStatistics,
  RequestStatisticsInput,
  SubpoenaStatistics,
  SubpoenaStatisticsInput,
} from '../statistics'
import { Subpoena } from '../subpoena'
import { DeliverCaseVerdictResponse, Verdict } from '../verdict'
import { DeleteVictimResponse, Victim } from '../victim'
import { backendModuleConfig } from './backend.config'

type Transformer<TResult> = (data: never) => TResult

// Find a way to get types from the backend
const caseTransformer = <TCase>(data: never): TCase => {
  const theCase = data as TCase & {
    dateLogs?: { dateType: DateType; date: string }[]
  }

  return {
    ...theCase,
    arraignmentDate: theCase.dateLogs?.find(
      (dateLog) => dateLog.dateType === DateType.ARRAIGNMENT_DATE,
    ),
    courtDate: theCase.dateLogs?.find(
      (dateLog) => dateLog.dateType === DateType.COURT_DATE,
    ),
  }
}

const lawyerTransformer: Transformer<Lawyer> = (data) => mapToLawyer(data)

const lawyersTransformer: Transformer<Lawyer[]> = (lawyers: []) =>
  lawyers.map((lawyer) => mapToLawyer(lawyer))

@Injectable()
export class BackendService extends DataSource<{ req: Request }> {
  private headers!: { [key: string]: string }
  private secretTokenHeaders!: { [key: string]: string }

  constructor(
    @Inject(backendModuleConfig.KEY)
    private readonly config: ConfigType<typeof backendModuleConfig>,
  ) {
    super()
    this.secretTokenHeaders = {
      'Content-Type': 'application/json',
      authorization: `Bearer ${this.config.secretToken}`,
    }
  }

  initialize(config: DataSourceConfig<{ req: Request }>): void {
    this.headers = {
      'Content-Type': 'application/json',
      authorization: config.context.req.headers.authorization as string,
      cookie: config.context.req.headers.cookie as string,
    }
  }

  private async callBackend<TResult>(
    route: string,
    options: RequestInit,
    transformer?: Transformer<TResult>,
  ): Promise<TResult> {
    return fetch(`${this.config.backendUrl}/api/${route}`, options).then(
      async (res) => {
        const response = await res.json()

        if (res.ok) {
          return transformer ? transformer(response as never) : response
        }

        throw new ProblemError(response)
      },
    )
  }

  private get<TResult>(
    route: string,
    transformer?: Transformer<TResult>,
  ): Promise<TResult> {
    return this.callBackend<TResult>(
      route,
      { headers: this.headers },
      transformer,
    )
  }

  private post<TBody, TResult>(
    route: string,
    body?: TBody,
    transformer?: Transformer<TResult>,
  ): Promise<TResult> {
    return this.callBackend<TResult>(
      route,
      { method: 'POST', body: JSON.stringify(body), headers: this.headers },
      transformer,
    )
  }

  private put<TBody, TResult>(
    route: string,
    body: TBody,
    transformer?: Transformer<TResult>,
  ): Promise<TResult> {
    return this.callBackend<TResult>(
      route,
      { method: 'PUT', body: JSON.stringify(body), headers: this.headers },
      transformer,
    )
  }

  private patch<TBody, TResult>(
    route: string,
    body: TBody,
    transformer?: Transformer<TResult>,
  ): Promise<TResult> {
    return this.callBackend<TResult>(
      route,
      { method: 'PATCH', body: JSON.stringify(body), headers: this.headers },
      transformer,
    )
  }

  private delete<TResult>(
    route: string,
    transformer?: Transformer<TResult>,
  ): Promise<TResult> {
    return this.callBackend<TResult>(
      route,
      { method: 'DELETE', headers: this.headers },
      transformer,
    )
  }

  getInstitutions(): Promise<Institution[]> {
    return this.get('institutions')
  }

  getUsers(): Promise<User[]> {
    return this.get('users')
  }

  getUser(userId: string): Promise<User> {
    return this.get(`user/${userId}`)
  }

  createUser(createUser: unknown): Promise<User> {
    return this.post('user', createUser)
  }

  updateUser(userId: string, updateUser: unknown): Promise<User> {
    return this.put(`user/${userId}`, updateUser)
  }

  getCases(): Promise<CaseListEntry[]> {
    return this.get('cases')
  }

  getCase(caseId: string): Promise<Case> {
    return this.get<Case>(`case/${caseId}`, caseTransformer)
  }

  getCaseTable(type: CaseTableType): Promise<CaseTableResponse> {
    return this.get<CaseTableResponse>(
      `case-table?type=${type}`,
      caseTransformer,
    )
  }

  searchCases(query: string): Promise<SearchCasesResponse> {
    const params = new URLSearchParams()
    params.append('query', query)

    return this.get(`search-cases?${params.toString()}`)
  }

  getCaseStatistics(
    fromDate?: Date,
    toDate?: Date,
    institutionId?: string,
  ): Promise<CaseStatistics> {
    const params = new URLSearchParams()

    if (fromDate) params.append('fromDate', fromDate.toISOString())
    if (toDate) params.append('toDate', toDate.toISOString())
    if (institutionId) params.append('institutionId', institutionId)

    return this.get(`cases/statistics?${params.toString()}`)
  }

  getIndictmentCaseStatistics(
    query: IndictmentStatisticsInput,
  ): Promise<IndictmentCaseStatistics> {
    const searchParams = this.serializeNestedObject(query)
    return this.get(`cases/indictments/statistics?${searchParams.toString()}`)
  }

  private serializeNestedObject<T extends object>(
    object: T,
    rootKey = 'query',
  ): string {
    const params = new URLSearchParams()
    Object.entries(object).forEach(([key, value]) => {
      if (value && typeof value === 'object' && !(value instanceof Date)) {
        // Note: currently only handle one level of nested object
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subValue !== undefined && subValue !== null && subValue !== '') {
            const valStr =
              subValue instanceof Date
                ? subValue.toISOString()
                : subValue.toString()
            params.append(`${rootKey}[${key}][${subKey}]`, valStr)
          }
        })
      } else if (value) {
        const valStr =
          value instanceof Date ? value.toISOString() : value.toString()
        params.append(`${rootKey}[${key}]`, valStr)
      }
    })

    return params.toString()
  }

  getRequestCaseStatistics(
    query: RequestStatisticsInput,
  ): Promise<RequestCaseStatistics> {
    const searchParams = this.serializeNestedObject(query)
    return this.get(`cases/requests/statistics?${searchParams}`)
  }

  getSubpoenaStatistics(
    query: SubpoenaStatisticsInput,
  ): Promise<SubpoenaStatistics> {
    const searchParams = this.serializeNestedObject(query)
    return this.get(`cases/subpoenas/statistics?${searchParams}`)
  }

  getPreprocessedDataCsvSignedUrl(
    query: CaseDataExportInput,
  ): Promise<SignedUrl> {
    const searchParams = this.serializeNestedObject(query)
    return this.get(`cases/statistics/export-csv?${searchParams}`)
  }

  getConnectedCases(caseId: string): Promise<Case[]> {
    return this.get(`case/${caseId}/connectedCases`)
  }

  getCandidateMergeCases(caseId: string): Promise<Case[]> {
    return this.get(`case/${caseId}/candidateMergeCases`)
  }

  createCase(createCase: unknown): Promise<Case> {
    return this.post<unknown, Case>('case', createCase, caseTransformer)
  }

  updateCase(caseId: string, updateCase: unknown): Promise<Case> {
    return this.patch<unknown, Case>(
      `case/${caseId}`,
      updateCase,
      caseTransformer,
    )
  }

  transitionCase(caseId: string, transitionCase: unknown): Promise<Case> {
    return this.patch<unknown, Case>(
      `case/${caseId}/state`,
      transitionCase,
      caseTransformer,
    )
  }

  requestCourtRecordSignature(
    caseId: string,
    method: 'audkenni' | 'mobile' = 'mobile',
  ): Promise<RequestSignatureResponse> {
    return this.post(`case/${caseId}/courtRecord/signature?method=${method}`)
  }

  getCourtRecordSignatureConfirmation(
    caseId: string,
    documentToken: string,
    method: 'audkenni' | 'mobile' = 'mobile',
  ): Promise<SignatureConfirmationResponse> {
    return this.get(
      `case/${caseId}/courtRecord/signature?documentToken=${documentToken}&method=${method}`,
    )
  }

  requestRulingSignature(
    caseId: string,
    method: 'audkenni' | 'mobile' = 'mobile',
  ): Promise<RequestSignatureResponse> {
    return this.post(`case/${caseId}/ruling/signature?method=${method}`)
  }

  getRulingSignatureConfirmation(
    caseId: string,
    documentToken: string,
    method: 'audkenni' | 'mobile' = 'mobile',
  ): Promise<SignatureConfirmationResponse> {
    return this.get(
      `case/${caseId}/ruling/signature?documentToken=${documentToken}&method=${method}`,
    )
  }

  sendNotification(
    caseId: string,
    sendNotification: unknown,
  ): Promise<SendNotificationResponse> {
    return this.post(`case/${caseId}/notification`, sendNotification)
  }

  extendCase(caseId: string): Promise<Case> {
    return this.post<unknown, Case>(
      `case/${caseId}/extend`,
      undefined,
      caseTransformer,
    )
  }

  splitDefendantFromCase(caseId: string, defendantId: string): Promise<Case> {
    return this.post<unknown, Case>(
      `case/${caseId}/defendant/${defendantId}/split`,
      undefined,
      caseTransformer,
    )
  }

  createCourtCase(caseId: string): Promise<Case> {
    return this.post<unknown, Case>(
      `case/${caseId}/court`,
      undefined,
      caseTransformer,
    )
  }

  deliverCaseVerdict(caseId: string) {
    return this.post<unknown, DeliverCaseVerdictResponse>(
      `case/${caseId}/deliverVerdict`,
    )
  }

  createCasePresignedPost(
    caseId: string,
    createPresignedPost: unknown,
  ): Promise<PresignedPost> {
    return this.post(`case/${caseId}/file/url`, createPresignedPost)
  }

  uploadCriminalRecordFile(
    caseId: string,
    defendantId: string,
  ): Promise<UploadCriminalRecordFileResponse> {
    return this.post(
      `case/${caseId}/defendant/${defendantId}/criminalRecordFile`,
    )
  }

  createCaseFile(caseId: string, createFile: unknown): Promise<CaseFile> {
    return this.post(`case/${caseId}/file`, createFile)
  }

  createDefendantCaseFile(
    caseId: string,
    createFile: unknown,
    defendantId: string,
  ): Promise<CaseFile> {
    return this.post(`case/${caseId}/defendant/${defendantId}/file`, createFile)
  }

  createCivilClaimantCaseFile(
    caseId: string,
    createFile: unknown,
    civilClaimantId: string,
  ): Promise<CaseFile> {
    return this.post(
      `case/${caseId}/civilClaimant/${civilClaimantId}/file`,
      createFile,
    )
  }

  getCaseFileSignedUrl(
    caseId: string,
    fileId: string,
    mergedCaseId?: string,
  ): Promise<SignedUrl> {
    const mergedCaseInjection = mergedCaseId
      ? `/mergedCase/${mergedCaseId}`
      : ''

    return this.get(`case/${caseId}${mergedCaseInjection}/file/${fileId}/url`)
  }

  rejectCaseFile(caseId: string, fileId: string): Promise<CaseFile> {
    return this.post(`case/${caseId}/file/${fileId}/reject`)
  }

  deleteCaseFile(caseId: string, fileId: string): Promise<DeleteFileResponse> {
    return this.delete(`case/${caseId}/file/${fileId}`)
  }

  uploadCaseFileToCourt(
    caseId: string,
    fileId: string,
  ): Promise<UploadFileToCourtResponse> {
    return this.post(`case/${caseId}/file/${fileId}/court`)
  }

  async updateFiles(
    caseId: string,
    updates: unknown[],
  ): Promise<UpdateFilesResponse> {
    const caseFiles: CaseFile[] = await this.patch(`case/${caseId}/files`, {
      files: updates,
    })
    return { caseFiles }
  }

  getPoliceCaseFiles(caseId: string): Promise<PoliceCaseFile[]> {
    return this.get(`case/${caseId}/policeFiles`)
  }

  getPoliceCaseInfo(caseId: string): Promise<PoliceCaseInfo[]> {
    return this.get(`case/${caseId}/policeCaseInfo`)
  }

  uploadPoliceFile(
    caseId: string,
    uploadPoliceCaseFile: unknown,
  ): Promise<UploadPoliceCaseFileResponse> {
    return this.post(`case/${caseId}/policeFile`, uploadPoliceCaseFile)
  }

  createDefendant(
    caseId: string,
    createDefendant: unknown,
  ): Promise<Defendant> {
    return this.post(`case/${caseId}/defendant`, createDefendant)
  }

  updateDefendant(
    caseId: string,
    defendantId: string,
    updateDefendant: unknown,
  ): Promise<Defendant> {
    return this.patch(
      `case/${caseId}/defendant/${defendantId}`,
      updateDefendant,
    )
  }

  limitedAccessUpdateDefendant(
    caseId: string,
    defendantId: string,
    updateDefendant: unknown,
  ): Promise<Defendant> {
    return this.patch(
      `case/${caseId}/limitedAccess/defendant/${defendantId}`,
      updateDefendant,
    )
  }

  deleteDefendant(
    caseId: string,
    defendantId: string,
  ): Promise<DeleteDefendantResponse> {
    return this.delete(`case/${caseId}/defendant/${defendantId}`)
  }

  getSubpoena(
    caseId: string,
    defendantId: string,
    subpoenaId: string,
  ): Promise<Subpoena> {
    return this.get(
      `case/${caseId}/defendant/${defendantId}/subpoena/${subpoenaId}`,
    )
  }

  createSubpoenas(
    caseId: string,
    createSubpoenas: {
      defendantIds: string[]
      arraignmentDate: string
      location?: string
    },
  ): Promise<Subpoena[]> {
    return this.post(`case/${caseId}/subpoenas`, createSubpoenas)
  }

  createVerdicts(caseId: string, createVerdicts: unknown): Promise<Verdict[]> {
    return this.post(`case/${caseId}/verdicts`, createVerdicts)
  }

  updateVerdict(
    caseId: string,
    defendantId: string,
    updateVerdict: unknown,
  ): Promise<Verdict> {
    return this.patch(
      `case/${caseId}/defendant/${defendantId}/verdict`,
      updateVerdict,
    )
  }

  getVerdict(caseId: string, defendantId: string): Promise<Verdict> {
    return this.get<Verdict>(`case/${caseId}/defendant/${defendantId}/verdict`)
  }

  createCivilClaimant(
    caseId: string,
    createCivilClaimant: unknown,
  ): Promise<CivilClaimant> {
    return this.post(`case/${caseId}/civilClaimant`, createCivilClaimant)
  }

  updateCivilClaimant(
    caseId: string,
    civilClaimantId: string,
    updateCivilClaimant: unknown,
  ): Promise<CivilClaimant> {
    return this.patch(
      `case/${caseId}/civilClaimant/${civilClaimantId}`,
      updateCivilClaimant,
    )
  }

  deleteCivilClaimant(
    caseId: string,
    civilClaimantId: string,
  ): Promise<DeleteCivilClaimantResponse> {
    return this.delete(`case/${caseId}/civilClaimant/${civilClaimantId}`)
  }

  createVictim(caseId: string, createVictim: unknown): Promise<Victim> {
    return this.post(`case/${caseId}/victim`, createVictim)
  }

  updateVictim(
    caseId: string,
    victimId: string,
    updateVictim: unknown,
  ): Promise<Victim> {
    return this.patch(`case/${caseId}/victim/${victimId}`, updateVictim)
  }

  deleteVictim(
    caseId: string,
    victimId: string,
  ): Promise<DeleteVictimResponse> {
    return this.delete(`case/${caseId}/victim/${victimId}`)
  }

  createIndictmentCount(
    caseId: string,
    createIndictmentCount: unknown,
  ): Promise<IndictmentCount> {
    return this.post(`case/${caseId}/indictmentCount`, createIndictmentCount)
  }

  updateIndictmentCount(
    caseId: string,
    indictmentCountId: string,
    updateIndictmentCount: unknown,
  ): Promise<IndictmentCount> {
    return this.patch(
      `case/${caseId}/indictmentCount/${indictmentCountId}`,
      updateIndictmentCount,
    )
  }

  deleteIndictmentCount(
    caseId: string,
    indictmentCountId: string,
  ): Promise<DeleteResponse> {
    return this.delete(`case/${caseId}/indictmentCount/${indictmentCountId}`)
  }

  createCourtSession(
    caseId: string,
    createCourtSession: unknown,
  ): Promise<CourtSessionResponse> {
    return this.post(`case/${caseId}/courtSession`, createCourtSession)
  }

  updateCourtSession(
    caseId: string,
    courtSessionId: string,
    updateCourtSession: unknown,
  ): Promise<CourtSessionResponse> {
    return this.patch(
      `case/${caseId}/courtSession/${courtSessionId}`,
      updateCourtSession,
    )
  }

  updateCourtSessionString(
    caseId: string,
    courtSessionId: string,
    updateCourtSessionString: unknown,
  ): Promise<CourtSessionString> {
    return this.patch(
      `case/${caseId}/courtSession/${courtSessionId}/courtSessionString`,
      updateCourtSessionString,
    )
  }

  deleteCourtSession(
    caseId: string,
    courtSessionId: string,
  ): Promise<DeleteCourtSessionResponse> {
    return this.delete(`case/${caseId}/courtSession/${courtSessionId}`)
  }

  createCourtDocument(
    caseId: string,
    courtSessionId: string,
    createCourtDocument: unknown,
  ): Promise<CourtDocumentResponse> {
    return this.post(
      `case/${caseId}/courtSession/${courtSessionId}/courtDocument`,
      createCourtDocument,
    )
  }

  updateCourtDocument(
    caseId: string,
    courtSessionId: string,
    courtDocumentId: string,
    updateCourtDocument: unknown,
  ): Promise<CourtDocumentResponse> {
    return this.patch(
      `case/${caseId}/courtSession/${courtSessionId}/courtDocument/${courtDocumentId}`,
      updateCourtDocument,
    )
  }

  fileCourtDocumentInCourtSession(
    caseId: string,
    courtSessionId: string,
    courtDocumentId: string,
  ): Promise<CourtDocumentResponse> {
    return this.patch(`case/${caseId}/courtDocument/${courtDocumentId}`, {
      courtSessionId,
    })
  }

  deleteCourtDocument(
    caseId: string,
    courtSessionId: string,
    courtDocumentId: string,
  ): Promise<DeleteCourtDocumentResponse> {
    return this.delete(
      `case/${caseId}/courtSession/${courtSessionId}/courtDocument/${courtDocumentId}`,
    )
  }

  createOffense(
    caseId: string,
    indictmentCountId: string,
    createOffense: unknown,
  ): Promise<Offense> {
    return this.post(
      `case/${caseId}/indictmentCount/${indictmentCountId}/offense`,
      createOffense,
    )
  }

  updateOffense(
    caseId: string,
    indictmentCountId: string,
    offenseId: string,
    updateOffense: unknown,
  ): Promise<Offense> {
    return this.patch(
      `case/${caseId}/indictmentCount/${indictmentCountId}/offense/${offenseId}`,
      updateOffense,
    )
  }

  deleteOffense(
    caseId: string,
    indictmentCountId: string,
    offenseId: string,
  ): Promise<DeleteResponse> {
    return this.delete(
      `case/${caseId}/indictmentCount/${indictmentCountId}/offense/${offenseId}`,
    )
  }

  limitedAccessGetCase(
    caseId: string,
    defendantIds?: string[],
  ): Promise<Case> {
    const query =
      defendantIds && defendantIds.length > 0
        ? `?${defendantIds.map((id) => `defendantIds=${id}`).join('&')}`
        : ''

    return this.get<Case>(
      `case/${caseId}/limitedAccess${query}`,
      caseTransformer,
    )
  }

  limitedAccessUpdateCase(caseId: string, updateCase: unknown): Promise<Case> {
    return this.patch<unknown, Case>(
      `case/${caseId}/limitedAccess`,
      updateCase,
      caseTransformer,
    )
  }

  limitedAccessTransitionCase(
    caseId: string,
    transitionCase: unknown,
  ): Promise<Case> {
    return this.patch<unknown, Case>(
      `case/${caseId}/limitedAccess/state`,
      transitionCase,
      caseTransformer,
    )
  }

  limitedAccessCreateCasePresignedPost(
    caseId: string,
    createPresignedPost: unknown,
  ): Promise<PresignedPost> {
    return this.post(
      `case/${caseId}/limitedAccess/file/url`,
      createPresignedPost,
    )
  }

  limitedAccessCreateCaseFile(
    caseId: string,
    createFile: unknown,
  ): Promise<CaseFile> {
    return this.post(`case/${caseId}/limitedAccess/file`, createFile)
  }

  limitedAccessCreateDefendantCaseFile(
    caseId: string,
    createFile: unknown,
    defendantId: string,
  ): Promise<CaseFile> {
    return this.post(
      `case/${caseId}/limitedAccess/defendant/${defendantId}/file`,
      createFile,
    )
  }

  limitedAccessCreateCivilClaimantCaseFile(
    caseId: string,
    createFile: unknown,
    civilClaimantId: string,
  ): Promise<CaseFile> {
    return this.post(
      `case/${caseId}/limitedAccess/civilClaimant/${civilClaimantId}/file`,
      createFile,
    )
  }

  limitedAccessGetCaseFileSignedUrl(
    caseId: string,
    fileId: string,
    mergedCaseId?: string,
  ): Promise<SignedUrl> {
    const mergedCaseInjection = mergedCaseId
      ? `/mergedCase/${mergedCaseId}`
      : ''

    return this.get(
      `case/${caseId}/limitedAccess${mergedCaseInjection}/file/${fileId}/url`,
    )
  }

  limitedAccessDeleteCaseFile(
    caseId: string,
    fileId: string,
  ): Promise<DeleteFileResponse> {
    return this.delete(`case/${caseId}/limitedAccess/file/${fileId}`)
  }

  createEventLog(eventLog: unknown): Promise<boolean> {
    return this.callBackend<boolean>('eventLog/event', {
      method: 'POST',
      body: JSON.stringify(eventLog),
      headers: this.secretTokenHeaders,
    })
  }

  findUsersByNationalId(nationalId: string): Promise<User[]> {
    const params = new URLSearchParams()
    params.append('nationalId', nationalId)

    return this.callBackend<User[]>(`user?${params.toString()}`, {
      headers: this.secretTokenHeaders,
    })
  }

  findDefenderByNationalId(nationalId: string): Promise<User> {
    const params = new URLSearchParams()
    params.append('nationalId', nationalId)

    return this.callBackend<User>(
      `cases/limitedAccess/defender?${params.toString()}`,
      { headers: this.secretTokenHeaders },
    )
  }

  getLawyers(lawyerType?: LawyerType): Promise<Lawyer[]> {
    let queryString = ''

    if (lawyerType) {
      const params = new URLSearchParams()
      params.append('lawyerType', lawyerType)
      const query = params.toString()
      queryString = `?${query}`
    }

    return this.callBackend(
      `lawyer-registry${queryString}`,
      { headers: this.secretTokenHeaders },
      lawyersTransformer,
    )
  }

  getLawyer(nationalId: string): Promise<Lawyer> {
    return this.callBackend(
      `lawyer-registry/${nationalId}`,
      { headers: this.secretTokenHeaders },
      lawyerTransformer,
    )
  }
}

export default BackendService
