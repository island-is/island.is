export interface Organization {
  id: string
  title: string
  slug: string
  logo: null | {
    id: string
    url: string
    title: string
    width: number
    height: number
  }
}
