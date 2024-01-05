import { DataSource, DataSourceConfig } from 'apollo-datasource'
import { Request } from 'express'

import { Injectable } from '@nestjs/common'

import { ProblemError } from '@island.is/nest/problem'

import type {
  Case,
  CaseFile,
  CaseListEntry,
  CreateCase,
  CreateDefendant,
  CreateFile,
  CreatePresignedPost,
  CreateUser,
  Defendant,
  DeleteDefendantResponse,
  DeleteFileResponse,
  Institution,
  Notification,
  PoliceCaseFile,
  PresignedPost,
  RequestSignatureResponse,
  SendNotification,
  SendNotificationResponse,
  SignatureConfirmationResponse,
  SignedUrl,
  TransitionCase,
  UpdateCase,
  UpdateDefendant,
  UpdateFile,
  UpdateUser,
  UploadFileToCourtResponse,
  UploadPoliceCaseFile,
  UploadPoliceCaseFileResponse,
  User,
} from '@island.is/judicial-system/types'

import { environment } from '../../environments'
import { UpdateFilesResponse } from '../modules/file'
import {
  CreateIndictmentCountInput,
  DeleteIndictmentCountInput,
  DeleteIndictmentCountResponse,
  IndictmentCount,
  UpdateIndictmentCountInput,
} from '../modules/indictment-count'
import { PoliceCaseInfo } from '../modules/police'

@Injectable()
export class BackendApi extends DataSource<{ req: Request }> {
  private headers!: { [key: string]: string }

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
  ): Promise<TResult> {
    return fetch(`${environment.backend.url}/api/${route}`, options).then(
      async (res) => {
        const response = await res.json()

        if (res.ok) {
          return response
        }

        throw new ProblemError(response)
      },
    )
  }

  private get<TResult>(route: string): Promise<TResult> {
    return this.callBackend<TResult>(route, { headers: this.headers })
  }

  private post<TBody, TResult>(route: string, body?: TBody): Promise<TResult> {
    return this.callBackend<TResult>(route, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: this.headers,
    })
  }

  private put<TBody, TResult>(route: string, body: TBody): Promise<TResult> {
    return this.callBackend<TResult>(route, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: this.headers,
    })
  }

  private patch<TBody, TResult>(route: string, body: TBody): Promise<TResult> {
    return this.callBackend<TResult>(route, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: this.headers,
    })
  }

  private delete<TResult>(route: string): Promise<TResult> {
    return this.callBackend<TResult>(route, {
      method: 'DELETE',
      headers: this.headers,
    })
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

  createUser(createUser: CreateUser): Promise<User> {
    return this.post('user', createUser)
  }

  updateUser(id: string, updateUser: UpdateUser): Promise<User> {
    return this.put(`user/${id}`, updateUser)
  }

  getCases(): Promise<CaseListEntry[]> {
    return this.get('cases')
  }

  getCase(id: string): Promise<Case> {
    return this.get(`case/${id}`)
  }

  createCase(createCase: CreateCase): Promise<Case> {
    return this.post('case', createCase)
  }

  updateCase(id: string, updateCase: UpdateCase): Promise<Case> {
    return this.patch(`case/${id}`, updateCase)
  }

  transitionCase(id: string, transitionCase: TransitionCase): Promise<Case> {
    return this.patch(`case/${id}/state`, transitionCase)
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
    sendNotification: SendNotification,
  ): Promise<SendNotificationResponse> {
    return this.post(`case/${id}/notification`, sendNotification)
  }

  extendCase(id: string): Promise<Case> {
    return this.post(`case/${id}/extend`)
  }

  createCourtCase(id: string): Promise<Case> {
    return this.post(`case/${id}/court`)
  }

  getCaseNotifications(id: string): Promise<Notification[]> {
    return this.get(`case/${id}/notifications`)
  }

  createCasePresignedPost(
    id: string,
    createPresignedPost: CreatePresignedPost,
  ): Promise<PresignedPost> {
    return this.post(`case/${id}/file/url`, createPresignedPost)
  }

  createCaseFile(id: string, createFile: CreateFile): Promise<CaseFile> {
    return this.post(`case/${id}/file`, createFile)
  }

  getCaseFileSignedUrl(caseId: string, id: string): Promise<SignedUrl> {
    return this.get(`case/${caseId}/file/${id}/url`)
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
    updates: UpdateFile[],
  ): Promise<UpdateFilesResponse> {
    const caseFiles: CaseFile[] = await this.patch<
      { files: UpdateFile[] },
      CaseFile[]
    >(`case/${caseId}/files`, { files: updates })
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
    uploadPoliceCaseFile: UploadPoliceCaseFile,
  ): Promise<UploadPoliceCaseFileResponse> {
    return this.post(`case/${caseId}/policeFile`, uploadPoliceCaseFile)
  }

  createDefendant(
    caseId: string,
    createDefendant: CreateDefendant,
  ): Promise<Defendant> {
    return this.post(`case/${caseId}/defendant`, createDefendant)
  }

  updateDefendant(
    caseId: string,
    defendantId: string,
    updateDefendant: UpdateDefendant,
  ): Promise<Defendant> {
    return this.patch(
      `case/${caseId}/defendant/${defendantId}`,
      updateDefendant,
    )
  }

  deleteDefendant(
    caseId: string,
    defendantId: string,
  ): Promise<DeleteDefendantResponse> {
    return this.delete(`case/${caseId}/defendant/${defendantId}`)
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
  ): Promise<DeleteIndictmentCountResponse> {
    const { caseId, indictmentCountId } = input

    return this.delete(`case/${caseId}/indictmentCount/${indictmentCountId}`)
  }

  limitedAccessGetCase(id: string): Promise<Case> {
    return this.get(`case/${id}/limitedAccess`)
  }

  limitedAccessUpdateCase(id: string, updateCase: UpdateCase): Promise<Case> {
    return this.patch(`case/${id}/limitedAccess`, updateCase)
  }

  limitedAccessTransitionCase(
    id: string,
    transitionCase: TransitionCase,
  ): Promise<Case> {
    return this.patch(`case/${id}/limitedAccess/state`, transitionCase)
  }

  limitedAccessCreateCasePresignedPost(
    id: string,
    createPresignedPost: CreatePresignedPost,
  ): Promise<PresignedPost> {
    return this.post(`case/${id}/limitedAccess/file/url`, createPresignedPost)
  }

  limitedAccessCreateCaseFile(
    id: string,
    createFile: CreateFile,
  ): Promise<CaseFile> {
    return this.post(`case/${id}/limitedAccess/file`, createFile)
  }

  limitedAccessGetCaseFileSignedUrl(
    caseId: string,
    id: string,
  ): Promise<SignedUrl> {
    return this.get(`case/${caseId}/limitedAccess/file/${id}/url`)
  }

  limitedAccessDeleteCaseFile(
    caseId: string,
    id: string,
  ): Promise<DeleteFileResponse> {
    return this.delete(`case/${caseId}/limitedAccess/file/${id}`)
  }

  limitedAccessGetAllFiles(caseId: string): Promise<Buffer> {
    return this.get(`case/${caseId}/limitedAccess/files/all`)
  }
}

export default BackendApi
