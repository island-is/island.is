import { Request, Response } from 'express'
import { SearchResult, ContentItem, WebSearchAutocomplete, SearcherInput } from './schema'

export interface HelloWorldService {
  getMessage(name: string): string
}

export interface SearcherService {
  find(query: SearcherInput): Promise<SearchResult>
  fetchSingle(input): Promise<ContentItem>
  fetchAutocompleteTerm(input): Promise<WebSearchAutocomplete>
}

export interface Context {
  req: Request
  res: Response
  helloWorld: HelloWorldService
  contentSearch: SearcherService
}
