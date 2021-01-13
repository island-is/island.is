/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import APIResponse from '../entities/common/APIResponse'
import api from './api'
import { ApiStatusStore } from '../store/ApiStatusStore'
import { getSession } from 'next-auth/client'

export class BaseService {
  protected static async GET(path: string): Promise<any | null> {
    ApiStatusStore.getInstance().clearStatus()
    const session = await getSession()

    if (!session) return BaseService.handleNoSession()

    try {
      const response = await api.get(path, BaseService.getConfig(session))
      return BaseService.handleResponse(response)
    } catch (error) {
      return BaseService.handleError(error)
    }
  }

  protected static async DELETE(
    path: string,
    body: unknown = null,
  ): Promise<any | null> {
    ApiStatusStore.getInstance().clearStatus()
    const session = await getSession()

    if (!session) return BaseService.handleNoSession()

    if (!body) {
      try {
        const response = await api.delete(path, BaseService.getConfig(session))
        return BaseService.handleResponse(response)
      } catch (error) {
        return BaseService.handleError(error)
      }
    }

    try {
      const response = await api.delete(
        path,
        BaseService.getConfigWithData(session, body),
      )
      return BaseService.handleResponse(response)
    } catch (error) {
      return BaseService.handleError(error)
    }
  }

  protected static async POST(
    path: string,
    body: unknown = null,
  ): Promise<any | null> {
    ApiStatusStore.getInstance().clearStatus()
    const session = await getSession()

    if (!session) return BaseService.handleNoSession()

    if (!body) {
      try {
        const response = await api.post(
          path,
          null,
          BaseService.getConfig(session),
        )
        return BaseService.handleResponse(response)
      } catch (error) {
        return BaseService.handleError(error)
      }
    }

    try {
      const response = await api.post(
        path,
        body,
        BaseService.getConfig(session),
      )
      return BaseService.handleResponse(response)
    } catch (error) {
      return BaseService.handleError(error)
    }
  }

  protected static async PUT(path: string, body: unknown): Promise<any | null> {
    ApiStatusStore.getInstance().clearStatus()
    const session = await getSession()

    if (!session) return BaseService.handleNoSession()

    try {
      const response = await api.put(path, body, BaseService.getConfig(session))
      return BaseService.handleResponse(response)
    } catch (error) {
      return BaseService.handleError(error)
    }
  }

  protected static async PATCH(
    path: string,
    body: unknown,
  ): Promise<any | null> {
    ApiStatusStore.getInstance().clearStatus()
    const session = await getSession()

    if (!session) return BaseService.handleNoSession()

    try {
      const response = await api.patch(
        path,
        body,
        BaseService.getConfig(session),
      )
      return BaseService.handleResponse(response)
    } catch (error) {
      return BaseService.handleError(error)
    }
  }

  protected static handleResponse(response: any): Promise<any | null> {
    const res = new APIResponse()
    res.statusCode = response.request.status
    res.message = response.request.statusText
    if (BaseService.isError(res)) {
      ApiStatusStore.getInstance().setStatus(res)
    }
    return response.data
  }

  private static isError(res: APIResponse) {
    if (res.statusCode > 299) {
      return true
    }
    return false
  }

  protected static handleError(error: any) {
    if (error?.response) {
      const res = new APIResponse()
      res.statusCode = error.request.status
      res.message = error.request.statusText
      ApiStatusStore.getInstance().setStatus(res)
    } else {
      ApiStatusStore.getInstance().setStatus({
        error: 'Unknown error',
        message: ['Could not connect to API'],
        statusCode: 1000, // TODO: What should the status code be? (at least nonzero)
      })
    }
  }

  private static handleNoSession() {
    ApiStatusStore.getInstance().setStatus({
      error: 'Unauthorized',
      message: ['Not authenticated.'],
      statusCode: 401,
    })
  }

  private static getConfig(session: any) {
    return {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    }
  }

  private static getConfigWithData(session: any, body: any) {
    return {
      headers: { Authorization: `Bearer ${session.accessToken}` },
      data: body,
    }
  }
}
