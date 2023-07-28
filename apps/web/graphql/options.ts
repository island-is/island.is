import { NextPageContext } from 'next'

export interface ClientOptions {
  bypassCache?: string
}

export function optionsFromContext(ctx?: NextPageContext): ClientOptions {
  return {
    bypassCache: ctx?.query?.['bypass-cache']?.toString(),
  }
}

export function optionsFromWindow(): ClientOptions {
  return {
    bypassCache: new URLSearchParams(window.location.search).get(
      'bypass-cache',
    ),
  }
}
