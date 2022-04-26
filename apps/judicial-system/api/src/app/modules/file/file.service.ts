import fetch, { Headers } from 'node-fetch'
import { Request, Response } from 'express'

import { Injectable } from '@nestjs/common'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'

import { environment } from '../../../environments'
import { FileExeption } from './file.exception'

@Injectable()
export class FileService {
  constructor(private readonly auditTrailService: AuditTrailService) {}

  private async getPdf(
    id: string,
    route: string,
    req: Request,
    res: Response,
  ): Promise<Response> {
    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('authorization', req.headers.authorization as string)
    headers.set('cookie', req.headers.cookie as string)

    const result = await fetch(
      `${environment.backend.url}/api/case/${id}/${route}`,
      { headers },
    )

    if (!result.ok) {
      throw new FileExeption(result.status, result.statusText)
    }

    const stream = result.body

    res.header('Content-length', result.headers.get('Content-Length') as string)

    return stream.pipe(res)
  }

  async tryGetPdf(
    userId: string,
    auditAction: AuditedAction,
    id: string,
    route: string,
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      return this.auditTrailService.audit(
        userId,
        auditAction,
        this.getPdf(id, route, req, res),
        id,
      )
    } catch (error) {
      if (error instanceof FileExeption) {
        return res.status(error.status).json(error.message)
      }

      throw error
    }
  }
}
