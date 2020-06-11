import { Request, Response } from 'express'
import {
  SearchResult,
  Document as ContentDocument,
} from '@island.is/api/content-search'

export interface HelloWorldService {
  getMessage(name: string): string
}

export interface SearcherService {
  find(query): Promise<SearchResult>
  fetchSingle(input): Promise<ContentDocument>
  fetchCategories(input): Promise<ContentDocument>
  fetchItems(input): Promise<ContentDocument>
}

export interface Context {
  req: Request
  res: Response
  helloWorld: HelloWorldService
  searcher: SearcherService
}
