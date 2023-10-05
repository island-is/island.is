import { Request, Response } from 'express'
import fetch, { Headers } from 'node-fetch'

import { Inject, Injectable } from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'
import { ProblemError } from '@island.is/nest/problem'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'

import { fileModuleConfig } from './file.config'
import { FileExeption } from './file.exception'

@Injectable()
export class FileService {
  constructor(
    @Inject(fileModuleConfig.KEY)
    private readonly config: ConfigType<typeof fileModuleConfig>,
    private readonly auditTrailService: AuditTrailService,
  ) {}

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
      `${this.config.backendUrl}/api/case/${id}/${route}`,
      { headers },
    ).then(async (res) => {
      if (res.ok) {
        return res
      }

      const response = await res.json()

      throw new ProblemError(response)
    })

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
