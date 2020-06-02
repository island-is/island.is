import express from 'express'
import { Context } from '@island.is/api/schema'
import {
  HelloWorldService,
  HelloWorldRepository,
} from '@island.is/api/domains/hello-world'

const helloWorldRepository = new HelloWorldRepository()
const helloWorld = new HelloWorldService(helloWorldRepository)

const singletons = {
  helloWorld,
}

export const createContext = (
  req: express.Request,
  res: express.Response,
): Context => {
  return {
    req,
    res,
    ...singletons,
  }
}
