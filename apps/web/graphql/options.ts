import type { ScreenContext } from '../types'

export interface ClientOptions {
  bypassCache?: string
}

export function optionsFromContext(
  ctx?: Partial<ScreenContext>,
): ClientOptions {
  return {
    bypassCache: ctx?.query?.['bypass-cache']?.toString(),
  }
}

export function optionsFromWindow(): ClientOptions {
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    bypassCache: new URLSearchParams(window.location.search).get(
      'bypass-cache',
    ),
  }
}
