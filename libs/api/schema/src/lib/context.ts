import { Request, Response } from 'express'
import {SearchResult} from "@island.is/api/searcher";

export interface HelloWorldService {
  getMessage(name: string): string
}

export interface SearcherService {
  find(query: string): Promise<SearchResult>
}

export interface Context {
  req: Request
  res: Response
  helloWorld: HelloWorldService
  searcher: SearcherService
}
