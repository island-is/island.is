import { DataSource, DataSourceConfig } from 'apollo-datasource'
import { Request } from 'express'

import { Inject, Injectable } from '@nestjs/common'

import { type ConfigType } from '@island.is/nest/config'
import { ProblemError } from '@island.is/nest/problem'

import {
  Lawyer,
  LawyerType,
  mapToLawyer,
} from '@island.is/judicial-system/types'
import {
  CaseTableType,
  DateType,
  type User,
} from '@island.is/judicial-system/types'

import {
  Case,
  RequestSignatureResponse,
  SendNotificationResponse,
  SignatureConfirmationResponse,
} from '../case'
import { CaseListEntry, CaseStatistics } from '../case-list'
import { CaseTableResponse, SearchCasesResponse } from '../case-table'
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
import {
  CreateIndictmentCountInput,
  CreateOffenseInput,
  DeleteIndictmentCountInput,
  DeleteOffenseInput,
  DeleteResponse,
  IndictmentCount,
  Offense,
  UpdateIndictmentCountInput,
  UpdateOffenseInput,
} from '../indictment-count'
import { Institution } from '../institution'
import {
  PoliceCaseFile,
  PoliceCaseInfo,
  UploadPoliceCaseFileResponse,
} from '../police'
import { Subpoena } from '../subpoena'
import { Verdict } from '../verdict'
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

  getUser(id: string): Promise<User> {
    return this.get(`user/${id}`)
  }

  createUser(createUser: unknown): Promise<User> {
    return this.post('user', createUser)
  }

  updateUser(id: string, updateUser: unknown): Promise<User> {
    return this.put(`user/${id}`, updateUser)
  }

  getCases(): Promise<CaseListEntry[]> {
    return this.get('cases')
  }

  getCase(id: string): Promise<Case> {
    return this.get<Case>(`case/${id}`, caseTransformer)
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

  getConnectedCases(id: string): Promise<Case[]> {
    return this.get(`case/${id}/connectedCases`)
  }

  createCase(createCase: unknown): Promise<Case> {
    return this.post<unknown, Case>('case', createCase, caseTransformer)
  }

  updateCase(id: string, updateCase: unknown): Promise<Case> {
    return this.patch<unknown, Case>(`case/${id}`, updateCase, caseTransformer)
  }

  transitionCase(id: string, transitionCase: unknown): Promise<Case> {
    return this.patch<unknown, Case>(
      `case/${id}/state`,
      transitionCase,
      caseTransformer,
    )
  }

  requestCourtRecordSignature(id: string): Promise<RequestSignatureResponse> {
    return this.post(`case/${id}/courtRecord/signature`)
  }

  getCourtRecordSignatureConfirmation(
    id: string,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    return this.get(
      `case/${id}/courtRecord/signature?documentToken=${documentToken}`,
    )
  }

  requestRulingSignature(id: string): Promise<RequestSignatureResponse> {
    return this.post(`case/${id}/ruling/signature`)
  }

  getRulingSignatureConfirmation(
    id: string,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    return this.get(
      `case/${id}/ruling/signature?documentToken=${documentToken}`,
    )
  }

  sendNotification(
    id: string,
    sendNotification: unknown,
  ): Promise<SendNotificationResponse> {
    return this.post(`case/${id}/notification`, sendNotification)
  }

  extendCase(id: string): Promise<Case> {
    return this.post<unknown, Case>(
      `case/${id}/extend`,
      undefined,
      caseTransformer,
    )
  }

  createCourtCase(id: string): Promise<Case> {
    return this.post<unknown, Case>(
      `case/${id}/court`,
      undefined,
      caseTransformer,
    )
  }

  createCasePresignedPost(
    id: string,
    createPresignedPost: unknown,
  ): Promise<PresignedPost> {
    return this.post(`case/${id}/file/url`, createPresignedPost)
  }

  uploadCriminalRecordFile(
    caseId: string,
    defendantId: string,
  ): Promise<UploadCriminalRecordFileResponse> {
    return this.post(
      `case/${caseId}/defendant/${defendantId}/criminalRecordFile`,
    )
  }

  createCaseFile(id: string, createFile: unknown): Promise<CaseFile> {
    return this.post(`case/${id}/file`, createFile)
  }

  createDefendantCaseFile(
    id: string,
    createFile: unknown,
    defendantId: string,
  ): Promise<CaseFile> {
    return this.post(`case/${id}/defendant/${defendantId}/file`, createFile)
  }

  createCivilClaimantCaseFile(
    id: string,
    createFile: unknown,
    civilClaimantId: string,
  ): Promise<CaseFile> {
    return this.post(
      `case/${id}/civilClaimant/${civilClaimantId}/file`,
      createFile,
    )
  }

  getCaseFileSignedUrl(
    caseId: string,
    id: string,
    mergedCaseId?: string,
  ): Promise<SignedUrl> {
    const mergedCaseInjection = mergedCaseId
      ? `/mergedCase/${mergedCaseId}`
      : ''

    return this.get(`case/${caseId}${mergedCaseInjection}/file/${id}/url`)
  }

  deleteCaseFile(caseId: string, id: string): Promise<DeleteFileResponse> {
    return this.delete(`case/${caseId}/file/${id}`)
  }

  uploadCaseFileToCourt(
    caseId: string,
    id: string,
  ): Promise<UploadFileToCourtResponse> {
    return this.post(`case/${caseId}/file/${id}/court`)
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

  updateVerdict(
    caseId: string,
    defendantId: string,
    verdictId: string,
    updateVerdict: unknown,
  ): Promise<Verdict> {
    return this.patch(
      `case/${caseId}/defendant/${defendantId}/verdict/${verdictId}`,
      updateVerdict,
    )
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
    input: CreateIndictmentCountInput,
  ): Promise<IndictmentCount> {
    const { caseId, ...createIndictmentCount } = input

    return this.post(`case/${caseId}/indictmentCount`, createIndictmentCount)
  }

  updateIndictmentCount(
    input: UpdateIndictmentCountInput,
  ): Promise<IndictmentCount> {
    const { caseId, indictmentCountId, ...updateIndictmentCount } = input

    return this.patch(
      `case/${caseId}/indictmentCount/${indictmentCountId}`,
      updateIndictmentCount,
    )
  }

  deleteIndictmentCount(
    input: DeleteIndictmentCountInput,
  ): Promise<DeleteResponse> {
    const { caseId, indictmentCountId } = input

    return this.delete(`case/${caseId}/indictmentCount/${indictmentCountId}`)
  }

  createOffense(input: CreateOffenseInput): Promise<Offense> {
    const { caseId, indictmentCountId, ...createOffense } = input

    return this.post(
      `case/${caseId}/indictmentCount/${indictmentCountId}/offense`,
      createOffense,
    )
  }

  updateOffense(input: UpdateOffenseInput): Promise<Offense> {
    const { caseId, indictmentCountId, offenseId, ...updateOffense } = input

    return this.patch(
      `case/${caseId}/indictmentCount/${indictmentCountId}/offense/${offenseId}`,
      updateOffense,
    )
  }

  deleteOffense(input: DeleteOffenseInput): Promise<DeleteResponse> {
    const { caseId, offenseId, indictmentCountId } = input

    return this.delete(
      `case/${caseId}/indictmentCount/${indictmentCountId}/offense/${offenseId}`,
    )
  }

  limitedAccessGetCase(id: string): Promise<Case> {
    return this.get<Case>(`case/${id}/limitedAccess`, caseTransformer)
  }

  limitedAccessUpdateCase(id: string, updateCase: unknown): Promise<Case> {
    return this.patch<unknown, Case>(
      `case/${id}/limitedAccess`,
      updateCase,
      caseTransformer,
    )
  }

  limitedAccessTransitionCase(
    id: string,
    transitionCase: unknown,
  ): Promise<Case> {
    return this.patch<unknown, Case>(
      `case/${id}/limitedAccess/state`,
      transitionCase,
      caseTransformer,
    )
  }

  limitedAccessCreateCasePresignedPost(
    id: string,
    createPresignedPost: unknown,
  ): Promise<PresignedPost> {
    return this.post(`case/${id}/limitedAccess/file/url`, createPresignedPost)
  }

  limitedAccessCreateCaseFile(
    id: string,
    createFile: unknown,
  ): Promise<CaseFile> {
    return this.post(`case/${id}/limitedAccess/file`, createFile)
  }

  limitedAccessCreateDefendantCaseFile(
    id: string,
    createFile: unknown,
    defendantId: string,
  ): Promise<CaseFile> {
    return this.post(
      `case/${id}/limitedAccess$/defendant/${defendantId}/file`,
      createFile,
    )
  }

  limitedAccessCreateCivilClaimantCaseFile(
    id: string,
    createFile: unknown,
    civilClaimantId: string,
  ): Promise<CaseFile> {
    return this.post(
      `case/${id}/limitedAccess$/civilClaimant/${civilClaimantId}/file`,
      createFile,
    )
  }

  limitedAccessGetCaseFileSignedUrl(
    caseId: string,
    id: string,
    mergedCaseId?: string,
  ): Promise<SignedUrl> {
    const mergedCaseInjection = mergedCaseId
      ? `/mergedCase/${mergedCaseId}`
      : ''

    return this.get(
      `case/${caseId}/limitedAccess${mergedCaseInjection}/file/${id}/url`,
    )
  }

  limitedAccessDeleteCaseFile(
    caseId: string,
    id: string,
  ): Promise<DeleteFileResponse> {
    return this.delete(`case/${caseId}/limitedAccess/file/${id}`)
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
