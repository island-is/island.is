export interface Document {
  _id: string | null
  title: string
  content: string
  tag: [string]
  date: string
  date_updated: Date | null
  category: string
  category_slug: string
  category_description: string
  subgroup: string
  containsApplicationForm: boolean
  importance: number
  group: string
  group_slug: string
  group_description: string
  lang: string
  url: string
  slug: string
  image: string
  image_text: string
  content_type: string
  content_id: string
  content_source: string
  term_pool: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content_blob: any
  nextSyncToken?: string
}
