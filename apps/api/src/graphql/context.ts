import express from 'express'
import { Context } from '@island.is/api/schema'
import {
  HelloWorldService,
  HelloWorldRepository,
} from '@island.is/api/domains/hello-world'
import {
  SearcherService,
  SearcherRepository,
} from '@island.is/api/domains/searcher'

const helloWorldRepository = new HelloWorldRepository()
const helloWorld = new HelloWorldService(helloWorldRepository)

const searcherRepository = new SearcherRepository()
const searcher = new SearcherService(searcherRepository)

const singletons = {
  helloWorld,
  searcher
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
