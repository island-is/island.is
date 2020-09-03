import { Request, Response } from 'express'
import {
  ContentCategory,
  SearchResult,
  ContentItem,
  WebSearchAutocompleteInput,
  WebSearchAutocomplete,
} from './schema'

export interface HelloWorldService {
  getMessage(name: string): string
}

export interface SearcherService {
  find(query): Promise<SearchResult>
  fetchSingle(input): Promise<ContentItem>
  fetchCategories(input): Promise<ContentCategory[]>
  fetchItems(input): Promise<ContentItem[]>
  fetchAutocompleteTerm(input): Promise<WebSearchAutocomplete>
}

export interface Context {
  req: Request
  res: Response
  helloWorld: HelloWorldService
  searcher: SearcherService
}
