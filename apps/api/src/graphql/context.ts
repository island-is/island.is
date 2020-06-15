import express from 'express'
import { Context } from '@island.is/api/schema'
import {
  HelloWorldService,
  HelloWorldRepository,
} from '@island.is/api/domains/hello-world'
import { SearcherService } from '@island.is/api/domains/content-search'
import { ElasticService } from '@island.is/api/content-search'

const helloWorldRepository = new HelloWorldRepository()
const helloWorld = new HelloWorldService(helloWorldRepository)

const elasticService = new ElasticService()
const searcher = new SearcherService(elasticService)

const singletons = {
  helloWorld,
  searcher,
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
