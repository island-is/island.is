export interface Document {
  _id: number | null
  title: string
  content: string
  tag: [string]
  category: string
  content_blob: string
  content_id: string
  content_type: string
  date: string
  image: string
  imageText: string
  lang: string
  slug: string
}
