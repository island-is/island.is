import { Request, Response } from 'express'

export type ExecuteStreamRequestArgs = {
  targetUrl: string
  accessToken: string
  req: Request
  res: Response
  body?: Record<string, unknown>
}
