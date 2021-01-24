import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'

import { Injectable } from '@nestjs/common'

import {
  Case,
  CreateCase,
  Notification,
  RequestSignatureResponse,
  SendNotification,
  SendNotificationResponse,
  SignatureConfirmationResponse,
  TransitionCase,
  UpdateCase,
  User,
} from '@island.is/judicial-system/types'

import { environment } from '../environments'

@Injectable()
class BackendAPI extends RESTDataSource {
  baseURL = `${environment.backendUrl}/api`

  willSendRequest(req: RequestOptions) {
    req.headers.set('authorization', this.context.req.headers.authorization)
    req.headers.set('cookie', this.context.req.headers.cookie)
  }

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
    const { prosecutor, ...updates } = updateCase

    if (prosecutor?.id) {
      return this.put(`case/${id}`, {
        ...updates,
        prosecutorId: prosecutor.id,
      })
    }

    return this.put(`case/${id}`, updates)
  }

  transitionCase(id: string, transitionCase: TransitionCase): Promise<Case> {
    return this.put(`case/${id}/state`, transitionCase)
  }

  requestSignature(id: string): Promise<RequestSignatureResponse> {
    return this.post(`case/${id}/signature`)
  }

  getSignatureConfirmation(
    id: string,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    return this.get(`case/${id}/signature?documentToken=${documentToken}`)
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

  getCaseNotifications(id: string): Promise<Notification[]> {
    return this.get(`case/${id}/notifications`)
  }
}

export default BackendAPI
