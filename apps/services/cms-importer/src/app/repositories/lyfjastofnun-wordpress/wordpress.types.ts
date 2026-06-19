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
