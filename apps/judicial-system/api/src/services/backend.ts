import { RESTDataSource } from 'apollo-datasource-rest'

import { Injectable } from '@nestjs/common'

import {
  Case,
  CreateCase,
  RequestSignatureResponse,
  SendNotification,
  ConfirmSignatureResponse,
  TransitionCase,
  UpdateCase,
  User,
  SendNotificationResponse,
} from '@island.is/judicial-system/types'

import { environment } from '../environments'

@Injectable()
class BackendAPI extends RESTDataSource {
  baseURL = `${environment.backendUrl}/api`

  getUser(nationalId: string): Promise<User> {
    return this.get(`user/${nationalId}`)
  }

  getCases(): Promise<Case[]> {
    return this.get('cases')
  }

  getCase(id: string): Promise<Case> {
    return this.get(`case/${id}`)
  }

  createCase(createCase: CreateCase): Promise<Case> {
    return this.post('case', createCase)
  }

  updateCase(id: string, updateCase: UpdateCase): Promise<Case> {
    return this.put(`case/${id}`, updateCase)
  }

  transitionCase(
    id: string,
    nationalId: string,
    transitionCase: TransitionCase,
  ): Promise<Case> {
    return this.put(`case/${id}/state`, { ...transitionCase, nationalId })
  }

  sendNotification(
    id: string,
    nationalId: string,
    sendNotification: SendNotification,
  ): Promise<SendNotificationResponse> {
    return this.post(`case/${id}/notification`, {
      ...sendNotification,
      nationalId,
    })
  }

  requestSignature(id: string): Promise<RequestSignatureResponse> {
    return this.post(`case/${id}/signature`)
  }

  confirmSignature(
    id: string,
    documentToken: string,
  ): Promise<ConfirmSignatureResponse> {
    return this.get(`case/${id}/signature?documentToken=${documentToken}`)
  }
}

export default BackendAPI
