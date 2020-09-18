export type Post = {
  id: string,
  title: string,
  date: string,
  alt: string,
  image: string,
  url: string
}

export type StaticPage = {
  id: string,
  title: string,
  slug: string,
  introText: string,
  body: any,
  buttons: any
}

export type Button = {
  id: string,
  label: string,
  linkUrl: string
}