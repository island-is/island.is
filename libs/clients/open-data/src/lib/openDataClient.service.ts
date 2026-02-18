import { Injectable, Inject } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import type { ConfigType } from '@island.is/nest/config'
import { OpenDataClientConfig } from './openDataClient.config'
import {
  Dataset,
  DatasetsResponse,
  GetDatasetsInput,
  DatasetFilter,
  Publisher,
  CKANPackage,
  CKANResource,
  CKANTag,
  CKANOrganization,
  CKANLicense,
  CKANGroup,
} from './openDataClient.types'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import * as https from 'https'

// Dummy data for fallback
const DUMMY_DATASETS: Dataset[] = [
  {
    id: '1',
    title: 'Population Statistics 2025',
    description:
      'Comprehensive population data including demographics, age distribution, and regional statistics.',
    category: 'Demographics',
    publisher: 'Statistics Iceland',
    publisherId: 'stats-iceland',
    lastUpdated: '2025-01-01',
    format: 'CSV',
    tags: ['population', 'demographics', 'statistics'],
  },
  {
    id: '2',
    title: 'Weather Data Archive',
    description:
      'Historical weather data from stations across Iceland including temperature, precipitation, and wind data.',
    category: 'Environment',
    publisher: 'Icelandic Met Office',
    publisherId: 'met-office',
    lastUpdated: '2024-12-15',
    format: 'JSON',
    tags: ['weather', 'climate', 'meteorology'],
  },
  {
    id: '3',
    title: 'Traffic Flow Data',
    description:
      'Real-time and historical traffic flow data from major roads and intersections.',
    category: 'Transportation',
    publisher: 'Road Administration',
    publisherId: 'road-admin',
    lastUpdated: '2024-12-20',
    format: 'API',
    tags: ['traffic', 'transportation', 'roads'],
  },
  {
    id: '4',
    title: 'Healthcare Service Locations',
    description:
      'Geographic data of healthcare facilities including hospitals, clinics, and emergency services.',
    category: 'Healthcare',
    publisher: 'Directorate of Health',
    publisherId: 'health-directorate',
    lastUpdated: '2024-11-30',
    format: 'GeoJSON',
    tags: ['healthcare', 'hospitals', 'medical'],
  },
  {
    id: '5',
    title: 'Economic Indicators',
    description:
      'Key economic indicators including GDP, inflation, unemployment rates, and trade statistics.',
    category: 'Economy',
    publisher: 'Central Bank of Iceland',
    publisherId: 'central-bank',
    lastUpdated: '2025-01-05',
    format: 'CSV',
    tags: ['economy', 'finance', 'indicators'],
  },
  {
    id: '6',
    title: 'Education Statistics',
    description:
      'Data on schools, student enrollment, graduation rates, and educational outcomes.',
    category: 'Education',
    publisher: 'Ministry of Education',
    publisherId: 'education-ministry',
    lastUpdated: '2024-12-10',
    format: 'JSON',
    tags: ['education', 'schools', 'students'],
  },
  {
    id: '7',
    title: 'Air Quality Measurements',
    description: 'Air quality monitoring data from stations throughout Iceland.',
    category: 'Environment',
    publisher: 'Environment Agency',
    publisherId: 'env-agency',
    lastUpdated: '2025-01-06',
    format: 'CSV',
    tags: ['environment', 'air-quality', 'pollution'],
  },
  {
    id: '8',
    title: 'Tourism Statistics',
    description:
      'Visitor numbers, accommodation data, and tourism-related economic impact statistics.',
    category: 'Tourism',
    publisher: 'Tourism Board',
    publisherId: 'tourism-board',
    lastUpdated: '2024-12-28',
    format: 'JSON',
    tags: ['tourism', 'visitors', 'hospitality'],
  },
  {
    id: '9',
    title: 'Energy Consumption Data',
    description:
      'Data on energy production and consumption across different sectors.',
    category: 'Energy',
    publisher: 'National Energy Authority',
    publisherId: 'energy-authority',
    lastUpdated: '2024-12-31',
    format: 'API',
    tags: ['energy', 'power', 'consumption'],
  },
  {
    id: '10',
    title: 'Public Transport Schedules',
    description:
      'Bus routes, schedules, and real-time location data for public transportation.',
    category: 'Transportation',
    publisher: 'Public Transport Authority',
    publisherId: 'transport-authority',
    lastUpdated: '2025-01-03',
    format: 'GTFS',
    tags: ['transport', 'bus', 'public-transit'],
  },
  {
    id: '11',
    title: 'Building Permits',
    description:
      'Data on building permits issued, including location, type, and value of construction projects.',
    category: 'Construction',
    publisher: 'Housing Authority',
    publisherId: 'housing-authority',
    lastUpdated: '2024-12-22',
    format: 'CSV',
    tags: ['construction', 'building', 'permits'],
  },
  {
    id: '12',
    title: 'Environmental Monitoring',
    description:
      'Data from environmental monitoring stations tracking various ecological parameters.',
    category: 'Environment',
    publisher: 'Environment Agency',
    publisherId: 'env-agency',
    lastUpdated: '2025-01-04',
    format: 'JSON',
    tags: ['environment', 'monitoring', 'ecology'],
  },
  {
    id: '13',
    title: 'Business Registry',
    description:
      'Information on registered businesses including industry classification and location data.',
    category: 'Economy',
    publisher: 'Statistics Iceland',
    publisherId: 'stats-iceland',
    lastUpdated: '2024-12-18',
    format: 'API',
    tags: ['business', 'registry', 'companies'],
  },
  {
    id: '14',
    title: 'Crime Statistics',
    description:
      'Anonymized crime data including incident types, locations, and temporal patterns.',
    category: 'Public Safety',
    publisher: 'Police Department',
    publisherId: 'police',
    lastUpdated: '2024-12-15',
    format: 'CSV',
    tags: ['crime', 'safety', 'police'],
  },
  {
    id: '15',
    title: 'Water Quality Data',
    description:
      'Water quality measurements from lakes, rivers, and coastal areas.',
    category: 'Environment',
    publisher: 'Environment Agency',
    publisherId: 'env-agency',
    lastUpdated: '2025-01-02',
    format: 'JSON',
    tags: ['water', 'quality', 'environment'],
  },
]

@Injectable()
export class OpenDataClientService {
  private readonly httpsAgent: https.Agent

  constructor(
    @Inject(OpenDataClientConfig.KEY)
    private config: ConfigType<typeof OpenDataClientConfig>,
    private readonly httpService: HttpService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {
    // Create HTTPS agent that ignores self-signed certificates for local development
    this.httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    })
  }

  private mapCKANToDataset(ckanPackage: CKANPackage): Dataset {
    // Get the first group title as the category (thematic grouping)
    const groupTitle = ckanPackage.groups?.[0]?.title || 
                       ckanPackage.groups?.[0]?.display_name || 
                       ckanPackage.groups?.[0]?.name || 
                       ''
    
    // Map all resources
    const resources = (ckanPackage.resources || []).map((res: CKANResource) => ({
      id: res.id || res.name || '',
      name: res.name || res.description || res.url || 'Unnamed resource',
      format: res.format || 'Unknown',
      url: res.url || '',
      size: res.size ? (typeof res.size === 'string' ? parseInt(res.size, 10) : res.size) : undefined,
      lastModified: res.last_modified || res.created || ckanPackage.metadata_modified,
      license: ckanPackage.license_title || ckanPackage.license_id || undefined,
    }))

    return {
      id: ckanPackage.id || ckanPackage.name,
      title: ckanPackage.title || ckanPackage.name,
      description: ckanPackage.notes || '',
      category: groupTitle,
      publisher: ckanPackage.organization?.title || 'Unknown',
      publisherId: ckanPackage.organization?.id || 'unknown',
      organizationImage: ckanPackage.organization?.image_url,
      lastUpdated:
        ckanPackage.metadata_modified || ckanPackage.metadata_created || '',
      format: ckanPackage.resources?.[0]?.format || 'Unknown',
      tags: ckanPackage.tags?.map((t: CKANTag) => t.name) || [],
      downloadUrl: ckanPackage.resources?.[0]?.url,
      resources,
      license: ckanPackage.license_title || ckanPackage.license_id,
      maintainer: ckanPackage.maintainer,
      maintainerEmail: ckanPackage.maintainer_email,
      author: ckanPackage.author,
      authorEmail: ckanPackage.author_email,
    }
  }

  // Simple Levenshtein distance for fuzzy matching in dummy data fallback
  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = []
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i]
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          )
        }
      }
    }
    return matrix[b.length][a.length]
  }

  // Check if a word fuzzy matches any word in a text
  private fuzzyMatchesText(searchWord: string, text: string, maxDistance: number = 2): boolean {
    const words = text.toLowerCase().split(/\s+/)
    const searchLower = searchWord.toLowerCase()
    
    return words.some((word) => {
      // Exact substring match
      if (word.includes(searchLower) || searchLower.includes(word)) {
        return true
      }
      // Fuzzy match with Levenshtein distance
      if (word.length >= 3 && searchLower.length >= 3) {
        return this.levenshteinDistance(searchLower, word) <= maxDistance
      }
      return false
    })
  }

  private filterDatasets(
    datasets: Dataset[],
    input: GetDatasetsInput,
  ): Dataset[] {
    let filtered = [...datasets]

    if (input.searchQuery) {
      const searchTerms = input.searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean)
      filtered = filtered.filter((d) =>
        searchTerms.every((term) =>
          // Check for exact substring match first
          d.title.toLowerCase().includes(term) ||
          d.description.toLowerCase().includes(term) ||
          d.tags.some((tag) => tag.toLowerCase().includes(term)) ||
          // Then check for fuzzy matches
          this.fuzzyMatchesText(term, d.title) ||
          this.fuzzyMatchesText(term, d.description) ||
          d.tags.some((tag) => this.fuzzyMatchesText(term, tag))
        ),
      )
    }

    if (input.categories && input.categories.length > 0) {
      filtered = filtered.filter((d) => input.categories?.includes(d.category))
    }

    if (input.publishers && input.publishers.length > 0) {
      filtered = filtered.filter((d) => input.publishers?.includes(d.publisher))
    }

    if (input.formats && input.formats.length > 0) {
      filtered = filtered.filter((d) => input.formats?.includes(d.format))
    }

    return filtered
  }

  async getDatasets(input: GetDatasetsInput): Promise<DatasetsResponse> {
    const page = input.page || 1
    const limit = input.limit || 12

    // Try to fetch from CKAN API if not using dummy data
    if (!this.config.useDummyData) {
      try {
        const queryParams: Record<string, string | number> = {
          rows: limit,
          start: (page - 1) * limit,
        }

        if (input.searchQuery) {
          // Add fuzzy search with Solr syntax (~2 = Levenshtein distance of 2)
          // This allows matching similar words (e.g., "test" matches "tests", "text", "best")
          const searchTerms = input.searchQuery.trim().split(/\s+/)
          const fuzzyTerms = searchTerms.map(term => `${term}~2`).join(' ')
          queryParams.q = fuzzyTerms
        }

        // Build CKAN filter query (fq) for server-side filtering
        const fqParts: string[] = []
        
        if (input.publishers && input.publishers.length > 0) {
          // CKAN uses organization name (slug) for filtering
          const orgFilter = input.publishers.map(p => `organization:${p}`).join(' OR ')
          fqParts.push(`(${orgFilter})`)
        }

        if (input.formats && input.formats.length > 0) {
          const formatFilter = input.formats.map(f => `res_format:${f}`).join(' OR ')
          fqParts.push(`(${formatFilter})`)
        }

        if (input.categories && input.categories.length > 0) {
          // Categories are typically stored as tags in CKAN
          const tagFilter = input.categories.map(c => `tags:${c}`).join(' OR ')
          fqParts.push(`(${tagFilter})`)
        }

        if (fqParts.length > 0) {
          queryParams.fq = fqParts.join(' AND ')
        }

        this.logger.info('Fetching from CKAN API', {
          url: this.config.basePath,
          params: queryParams,
        })

        // Debug: Log the full URL being requested
        const fullUrl = new URL(`${this.config.basePath}/package_search`)
        Object.entries(queryParams).forEach(([key, value]) => {
          fullUrl.searchParams.append(key, String(value))
        })
        this.logger.info('=== CKAN QUERY DEBUG ===')
        this.logger.info(`FULL URL: ${fullUrl.toString()}`)
        this.logger.info(`Search query (q): ${queryParams.q}`)
        this.logger.info(`Input searchQuery: ${input.searchQuery}`)
        this.logger.info(`Input publishers: ${JSON.stringify(input.publishers)}`)
        this.logger.info(`Input categories: ${JSON.stringify(input.categories)}`)
        this.logger.info(`Input formats: ${JSON.stringify(input.formats)}`)
        this.logger.info(`fq query: ${queryParams.fq}`)

        const response = await firstValueFrom(
          this.httpService.get(`${this.config.basePath}/package_search`, {
            params: queryParams,
            timeout: 10000,
            headers: {
              'Accept': 'application/json',
            },
            httpsAgent: this.httpsAgent,
          }),
        )

        this.logger.info('CKAN API response received', {
          success: response.data.success,
          count: response.data.result?.count,
          fq: queryParams.fq,
        })

        // Debug: Print organization names from actual datasets
        this.logger.info('=== CKAN RESPONSE DEBUG ===')
        this.logger.info(`Success: ${response.data.success}`)
        this.logger.info(`Count: ${response.data.result?.count}`)
        this.logger.info(`Results count: ${response.data.result?.results?.length}`)
        if (response.data.result?.results?.length > 0) {
          this.logger.info(`First result org name: ${response.data.result.results[0]?.organization?.name}`)
          this.logger.info(`First result org title: ${response.data.result.results[0]?.organization?.title}`)
          const orgNames = response.data.result.results.map((r: CKANPackage) => r.organization?.name)
          this.logger.info(`All org names in results: ${JSON.stringify(orgNames)}`)
        }

        if (response.data.success && response.data.result) {
          const datasets = response.data.result.results.map((pkg: CKANPackage) =>
            this.mapCKANToDataset(pkg),
          )

          return {
            datasets,
            total: response.data.result.count,
            page,
            limit,
            hasMore: (page - 1) * limit + datasets.length < response.data.result.count,
          }
        }
      } catch (error) {
        this.logger.warn('Failed to fetch from CKAN API, falling back to dummy data', {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        })
      }
    }

    // Fallback to dummy data
    const filtered = this.filterDatasets(DUMMY_DATASETS, input)
    const startIndex = (page - 1) * limit
    const paginatedDatasets = filtered.slice(startIndex, startIndex + limit)

    return {
      datasets: paginatedDatasets,
      total: filtered.length,
      page,
      limit,
      hasMore: startIndex + paginatedDatasets.length < filtered.length,
    }
  }

  async getDataset(id: string): Promise<Dataset | null> {
    if (!this.config.useDummyData) {
      try {
        this.logger.info('Fetching dataset from CKAN API', { id })

        const response = await firstValueFrom(
          this.httpService.get(`${this.config.basePath}/package_show`, {
            params: { id },
            timeout: 10000,
            headers: {
              'Accept': 'application/json',
            },
            httpsAgent: this.httpsAgent,
          }),
        )

        if (response.data.success && response.data.result) {
          return this.mapCKANToDataset(response.data.result)
        }
      } catch (error) {
        this.logger.warn('Failed to fetch dataset from CKAN API', {
          id,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return DUMMY_DATASETS.find((d) => d.id === id) || null
  }

  async getFilters(): Promise<DatasetFilter[]> {
    // Try to fetch from CKAN API
    if (!this.config.useDummyData) {
      try {
        // Fetch organizations, tags, licenses, and groups from CKAN
        const [orgsResponse, tagsResponse, licensesResponse, groupsResponse] = await Promise.all([
          firstValueFrom(
            this.httpService.get(`${this.config.basePath}/organization_list`, {
              params: { all_fields: true },
              timeout: 10000,
              headers: { 'Accept': 'application/json' },
              httpsAgent: this.httpsAgent,
            }),
          ),
          firstValueFrom(
            this.httpService.get(`${this.config.basePath}/tag_list`, {
              params: { all_fields: true },
              timeout: 10000,
              headers: { 'Accept': 'application/json' },
              httpsAgent: this.httpsAgent,
            }),
          ),
          firstValueFrom(
            this.httpService.get(`${this.config.basePath}/license_list`, {
              timeout: 10000,
              headers: { 'Accept': 'application/json' },
              httpsAgent: this.httpsAgent,
            }),
          ),
          firstValueFrom(
            this.httpService.get(`${this.config.basePath}/group_list`, {
              params: { all_fields: true },
              timeout: 10000,
              headers: { 'Accept': 'application/json' },
              httpsAgent: this.httpsAgent,
            }),
          ),
        ])

        // Get formats from a sample of datasets
        const datasetsResponse = await firstValueFrom(
          this.httpService.get(`${this.config.basePath}/package_search`, {
            params: { rows: 100 },
            timeout: 10000,
            headers: { 'Accept': 'application/json' },
            httpsAgent: this.httpsAgent,
          }),
        )

        const filters: DatasetFilter[] = []

        // Organizations (Stofnun / Ráðuneyti) - only include orgs with datasets
        if (orgsResponse.data.success && orgsResponse.data.result) {
          const orgs = orgsResponse.data.result
            .filter((org: CKANOrganization) => (org.package_count || 0) > 0) // Only orgs with datasets
          filters.push({
            id: 'organization',
            field: 'publisher',
            label: 'Stofnun / Ráðuneyti',
            options: orgs.map((org: CKANOrganization) => ({
              value: org.name, // Use org name (slug) for CKAN filtering
              label: org.title || org.name,
              count: org.package_count || 0,
            })),
          })
        }

        // Categories/Tags (Efnisflokkur)
        if (tagsResponse.data.success && tagsResponse.data.result) {
          const tags = tagsResponse.data.result
          filters.push({
            id: 'category',
            field: 'category',
            label: 'Efnisflokkur',
            options: Array.isArray(tags) 
              ? tags.slice(0, 20).map((tag: CKANTag | string) => ({
                  value: typeof tag === 'string' ? tag : tag.name,
                  label: typeof tag === 'string' ? tag : tag.display_name || tag.name,
                }))
              : [],
          })
        }

        // Formats (Gagnsnið)
        if (datasetsResponse.data.success && datasetsResponse.data.result) {
          const formats = new Set<string>()
          datasetsResponse.data.result.results.forEach((pkg: CKANPackage) => {
            pkg.resources?.forEach((resource: CKANResource) => {
              if (resource.format) {
                formats.add(resource.format.toUpperCase())
              }
            })
          })
          filters.push({
            id: 'format',
            field: 'format',
            label: 'Gagnsnið',
            options: Array.from(formats).sort().map((f) => ({
              value: f,
              label: f,
            })),
          })
        }

        // Dataset status (Staða gagnasetts) - derived from metadata
        filters.push({
          id: 'status',
          field: 'status',
          label: 'Staða gagnasetts',
          options: [
            { value: 'active', label: 'Virkt' },
            { value: 'inactive', label: 'Óvirkt' },
            { value: 'draft', label: 'Drög' },
          ],
        })

        // Last updated (Síðast uppfært) - time ranges
        filters.push({
          id: 'lastUpdated',
          field: 'lastUpdated',
          label: 'Síðast uppfært',
          options: [
            { value: 'week', label: 'Síðustu 7 daga' },
            { value: 'month', label: 'Síðasta mánuð' },
            { value: 'quarter', label: 'Síðustu 3 mánuði' },
            { value: 'year', label: 'Síðasta ár' },
          ],
        })

        // Update frequency (Uppfærslutíðni)
        filters.push({
          id: 'updateFrequency',
          field: 'updateFrequency',
          label: 'Uppfærslutíðni',
          options: [
            { value: 'daily', label: 'Daglega' },
            { value: 'weekly', label: 'Vikulega' },
            { value: 'monthly', label: 'Mánaðarlega' },
            { value: 'quarterly', label: 'Ársfjórðungslega' },
            { value: 'annually', label: 'Árlega' },
            { value: 'irregular', label: 'Óreglulega' },
          ],
        })

        // Data time period (Tímabil gagna)
        filters.push({
          id: 'timePeriod',
          field: 'timePeriod',
          label: 'Tímabil gagna',
          options: [
            { value: '2025', label: '2025' },
            { value: '2024', label: '2024' },
            { value: '2023', label: '2023' },
            { value: '2022', label: '2022' },
            { value: '2021', label: '2021' },
            { value: 'older', label: 'Eldra' },
          ],
        })

        // License (Noktunarleyfi)
        if (licensesResponse.data.success && licensesResponse.data.result) {
          const licenses = licensesResponse.data.result
          filters.push({
            id: 'license',
            field: 'license',
            label: 'Noktunarleyfi',
            options: licenses.map((license: CKANLicense) => ({
              value: license.id || license.name,
              label: license.title || license.name || license.id,
            })),
          })
        }

        // Groups (Flokkun) - if available
        if (groupsResponse.data.success && groupsResponse.data.result) {
          const groups = groupsResponse.data.result
          if (groups.length > 0) {
            filters.push({
              id: 'group',
              field: 'group',
              label: 'Flokkun',
              options: groups.map((group: CKANGroup) => ({
                value: group.name,
                label: group.title || group.display_name || group.name,
                count: group.package_count || 0,
              })),
            })
          }
        }

        this.logger.info('CKAN filters fetched successfully', {
          filterCount: filters.length,
        })

        return filters
      } catch (error) {
        this.logger.warn('Failed to fetch filters from CKAN API, falling back to dummy data', {
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    // Fallback to dummy data
    const datasets = DUMMY_DATASETS

    const categories = Array.from(new Set(datasets.map((d) => d.category)))
    const publishers = Array.from(new Set(datasets.map((d) => d.publisher)))
    const formats = Array.from(new Set(datasets.map((d) => d.format)))

    return [
      {
        id: 'organization',
        field: 'publisher',
        label: 'Stofnun / Ráðuneyti',
        options: publishers.map((p) => ({ value: p, label: p })),
      },
      {
        id: 'category',
        field: 'category',
        label: 'Efnisflokkur',
        options: categories.map((c) => ({ value: c, label: c })),
      },
      {
        id: 'format',
        field: 'format',
        label: 'Gagnsnið',
        options: formats.map((f) => ({ value: f, label: f })),
      },
      {
        id: 'status',
        field: 'status',
        label: 'Staða gagnasetts',
        options: [
          { value: 'active', label: 'Virkt' },
          { value: 'inactive', label: 'Óvirkt' },
        ],
      },
      {
        id: 'lastUpdated',
        field: 'lastUpdated',
        label: 'Síðast uppfært',
        options: [
          { value: 'week', label: 'Síðustu 7 daga' },
          { value: 'month', label: 'Síðasta mánuð' },
          { value: 'year', label: 'Síðasta ár' },
        ],
      },
      {
        id: 'updateFrequency',
        field: 'updateFrequency',
        label: 'Uppfærslutíðni',
        options: [
          { value: 'daily', label: 'Daglega' },
          { value: 'weekly', label: 'Vikulega' },
          { value: 'monthly', label: 'Mánaðarlega' },
          { value: 'annually', label: 'Árlega' },
        ],
      },
      {
        id: 'timePeriod',
        field: 'timePeriod',
        label: 'Tímabil gagna',
        options: [
          { value: '2025', label: '2025' },
          { value: '2024', label: '2024' },
          { value: '2023', label: '2023' },
        ],
      },
      {
        id: 'license',
        field: 'license',
        label: 'Noktunarleyfi',
        options: [
          { value: 'cc-by', label: 'Creative Commons BY' },
          { value: 'cc-by-sa', label: 'Creative Commons BY-SA' },
          { value: 'odc-by', label: 'Open Data Commons BY' },
        ],
      },
    ]
  }

  async getPublishers(): Promise<Publisher[]> {
    const datasets = DUMMY_DATASETS
    const publishersMap = new Map<string, Publisher>()

    datasets.forEach((d) => {
      if (!publishersMap.has(d.publisherId)) {
        publishersMap.set(d.publisherId, {
          id: d.publisherId,
          name: d.publisher,
        })
      }
    })

    return Array.from(publishersMap.values())
  }
}
