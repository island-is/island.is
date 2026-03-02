export interface DatasetResource {
  id: string
  name: string
  format: string
  url: string
  size?: number
  lastModified?: string
  license?: string
}

export interface Dataset {
  id: string
  title: string
  description: string
  category: string
  publisher: string
  publisherId: string
  organizationImage?: string
  lastUpdated: string
  format: string
  tags: string[]
  downloadUrl?: string
  metadata?: DatasetMetadata
  resources?: DatasetResource[]
  license?: string
  maintainer?: string
  maintainerEmail?: string
  author?: string
  authorEmail?: string
}

export interface DatasetMetadata {
  size?: string
  recordCount?: number
  updateFrequency?: string
}

export interface DatasetFilter {
  id: string
  field: string
  label: string
  options: FilterOption[]
}

export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface GetDatasetsInput {
  searchQuery?: string
  categories?: string[]
  publishers?: string[]
  formats?: string[]
  page?: number
  limit?: number
}

export interface DatasetsResponse {
  datasets: Dataset[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface Publisher {
  id: string
  name: string
  website?: string
}

// CKAN API Response types
export interface CKANResource {
  id?: string
  name?: string
  description?: string
  format?: string
  url?: string
  size?: string | number
  last_modified?: string
  created?: string
}

export interface CKANTag {
  name: string
  display_name?: string
}

export interface CKANOrganization {
  id: string
  name: string
  title?: string
  image_url?: string
  image_display_url?: string
  package_count?: number
}

export interface CKANGroup {
  id?: string
  name: string
  title?: string
  display_name?: string
  package_count?: number
}

export interface CKANLicense {
  id: string
  name?: string
  title?: string
}

export interface CKANPackage {
  id: string
  name: string
  title?: string
  notes?: string
  organization?: CKANOrganization
  metadata_created?: string
  metadata_modified?: string
  tags?: CKANTag[]
  resources?: CKANResource[]
  groups?: CKANGroup[]
  license_id?: string
  license_title?: string
  maintainer?: string
  maintainer_email?: string
  author?: string
  author_email?: string
}

export interface CKANResponse {
  success: boolean
  result: {
    count: number
    results: CKANPackage[]
  }
}
