import { Directive } from '@nestjs/graphql'

export interface CacheControlOptions {
  maxAge?: number
  scope?: 'PRIVATE' | 'PUBLIC'
  inheritMaxAge?: boolean
}

export const CacheControl = ({
  maxAge,
  scope = 'PUBLIC',
  inheritMaxAge,
}: CacheControlOptions = {}) =>
  Directive(
    `@cacheControl(scope: ${scope}${
      maxAge !== undefined ? `, maxAge: ${maxAge}` : ''
    }${inheritMaxAge ? `, inheritMaxAge: ${inheritMaxAge}` : ''})`,
  )
