import { Entry } from 'contentful-management/dist/typings/entities/entry'

export const DEFAULT_LOCALE = 'is-IS'

export const translationsFromContentful = (namespace: Entry) =>
  namespace?.fields?.strings?.[DEFAULT_LOCALE] ?? []
