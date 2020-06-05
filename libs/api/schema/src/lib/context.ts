import { Request, Response } from 'express'
import {SearchResult} from "@island.is/api/content-search";

export interface HelloWorldService {
  getMessage(name: string): string
}

export interface SearcherService {
  find(query): Promise<SearchResult>
  getArticle(input): Promise<SearchResult>
}

export interface Context {
  req: Request
  res: Response
  helloWorld: HelloWorldService
  searcher: SearcherService
}
