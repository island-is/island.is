import { Request, Response } from 'express'
import { SearchResult, ContentItem, WebSearchAutocomplete } from './schema'

export interface HelloWorldService {
  getMessage(name: string): string
}

export interface SearcherService {
  find(query): Promise<SearchResult>
  fetchSingle(input): Promise<ContentItem>
  fetchItems(input): Promise<ContentItem[]>
  fetchAutocompleteTerm(input): Promise<WebSearchAutocomplete>
}

export interface Context {
  req: Request
  res: Response
  helloWorld: HelloWorldService
  searcher: SearcherService
}
