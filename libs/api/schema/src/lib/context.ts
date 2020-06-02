import { Request, Response } from 'express'

export interface HelloWorldService {
  getMessage(name: string): string
}

export interface Context {
  req: Request
  res: Response
  helloWorld: HelloWorldService
}
