import { Request, Response } from 'express'
import {
  SearchResult,
  ContentItem,
  WebSearchAutocomplete,
  SearcherInput,
} from './schema'

export interface HelloWorldService {
  getMessage(name: string): string
}

export interface Context {
  req: Request
  res: Response
  helloWorld: HelloWorldService
}
