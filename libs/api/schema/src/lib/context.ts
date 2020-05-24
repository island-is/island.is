import { Request, Response } from 'express'
import { HelloWorldService } from '@island.is/api/domains/hello-world'

export interface Context {
  req: Request
  res: Response
  helloWorld: HelloWorldService
}
