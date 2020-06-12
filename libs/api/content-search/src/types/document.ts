export interface Document {
  _id: string | null
  title: string
  content: string
  tag: [string]
  date: string
  date_updated: Date | null
  category: string
  category_slug: string
  group: string
  group_slug: string
  lang: string
  url: string
  slug: string
  image: string
  image_text: string
  content_type: string
  content_id: string
  content_source: string
  content_blob: any
  nextSyncToken: string
  _category: {
    slug: string | null
    title: string | null
    description: string | null
  }
}
