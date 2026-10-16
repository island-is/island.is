import { Request, Response } from 'express'

export interface Context {
  req: Request
  res: Response
}

// Make it build everything
