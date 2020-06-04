import { EntryCollection } from 'contentful'
import { Document } from '@contentful/rich-text-types'

interface Article {
  id: string
  title: string
  description: Document
  ctaLabel?: string
  ctaUrl?: string
  content: Document
}

export type RawArticle = EntryCollection<Article>
