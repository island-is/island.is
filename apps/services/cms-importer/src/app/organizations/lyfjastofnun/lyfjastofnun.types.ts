export interface LyfjastofnunScrapedItem {
  title: string
  titleEn?: string
  groupTitle: string
  // Short per-item category label shown on the page, distinct from the longer
  // `groupTitle` heading above it. Only the forms page's items are categorised
  // this way in Contentful; the other jobs key off `groupTitle`.
  categoryTitle?: string
  fileUrl?: string
  externalUrl?: string
}

export interface WpFeaturedMedia {
  source_url: string
  title: { rendered: string }
}

export interface WpPost {
  id: number
  date: string
  slug: string
  link: string
  title: { rendered: string }
  excerpt?: { rendered: string }
  content?: { rendered: string }
  _embedded?: {
    'wp:featuredmedia'?: WpFeaturedMedia[]
  }
}
