import { Request, Response } from 'express'
import {
  SearchResult,
  SearcherInput,
  ContentItem,
  WebSearchAutocomplete,
} from '@island.is/api/domains/content-search'

export interface SearcherService {
  find(query: SearcherInput): Promise<SearchResult>
  fetchSingle(input): Promise<ContentItem>
  fetchAutocompleteTerm(input): Promise<WebSearchAutocomplete>
}

export interface Context {
  req: Request
  res: Response
  contentSearch: SearcherService
}
