export type SystemMetadata<DataType> = DataType & {
  typename: string
}

export enum CustomPageUniqueIdentifier {
  PensionCalculator = 'PensionCalculator',
  OfficialJournalOfIceland = 'OfficialJournalOfIceland',
  OfficialJournalOfIcelandHelp = 'OfficialJournalOfIcelandHelp',
  Vacancies = 'Vacancies',
  Grants = 'Grants',
  DirectorateOfLabourMyPages = 'DirectorateOfLabourMyPages',
  Verdicts = 'Verdicts',
  BloodDonationRestrictions = 'BloodDonationRestrictions',
}

export interface StatisticSourceValue {
  header: string
  value: number | null
}

export type StatisticSourceData<T extends string = string> = {
  data: Record<T, StatisticSourceValue[]>
}

export enum SitemapTreeNodeType {
  ENTRY = 'entry',
  CATEGORY = 'category',
  URL = 'url',
}

export type SitemapTreeNode = SitemapTree &
  (
    | {
        type: SitemapTreeNodeType.ENTRY
        entryId: string
        primaryLocation: boolean // Whether the parent nodes above are the "main breadcrumb path" (always true unless the entry is in multiple places in the sitemap)
      }
    | {
        type: SitemapTreeNodeType.CATEGORY
        label: string
        labelEN?: string
        slug: string
        slugEN?: string
        description: string
        descriptionEN?: string
      }
    | {
        type: SitemapTreeNodeType.URL
        label: string
        labelEN?: string
        url: string
        urlEN?: string
        urlType?: 'custom'
      }
  )

export type SitemapTree = {
  id: number
  childNodes: SitemapTreeNode[]
}
