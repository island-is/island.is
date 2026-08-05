export type RskTreatyLinkKind = 'is' | 'en' | 'other'

export interface RskTreatyLink {
  kind: RskTreatyLinkKind
  /** Raw anchor text from the source page, e.g. 'íslensku', 'ensku', 'dönsku' */
  label: string
  href: string
}

export type RskTreatyTabKey = 'samningar' | 'upplysingaskipti' | 'adrirSamningar'

export interface RskTreatyDocument {
  /** e.g. 'Viðauki/breyting 1997' — undefined for the base document of an item */
  label?: string
  /** Which source table this document came from — needed per-document (not
   * just per-item) since a merged cross-section item like Andorra carries
   * documents from two different tables. */
  tabKey: RskTreatyTabKey
  links: RskTreatyLink[]
}

export interface RskTreatyItem {
  name: string
  tabKeys: RskTreatyTabKey[]
  documents: RskTreatyDocument[]
}

export type RskResolvedLink =
  | { type: 'asset'; url: string }
  | { type: 'hyperlink'; url: string }
