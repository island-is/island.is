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
    this.httpsAgent = new https.Agent({
      rejectUnauthorized: this.config.rejectUnauthorized,
    })
  }

  private mapCKANToDataset(ckanPackage: CKANPackage): Dataset {
    // Get the first group title as the category (thematic grouping)
    const groupTitle =
      ckanPackage.groups?.[0]?.title ||
      ckanPackage.groups?.[0]?.display_name ||
      ckanPackage.groups?.[0]?.name ||
      ''

    // Map all resources
    const resources = (ckanPackage.resources || []).map(
      (res: CKANResource) => ({
        id: res.id || res.name || '',
        name: res.name || res.description || res.url || 'Unnamed resource',
        format: res.format || 'Unknown',
        url: res.url || '',
        size:
          res.size === null || res.size === undefined
            ? undefined
            : typeof res.size === 'string'
            ? Number.isNaN(Number.parseInt(res.size, 10))
              ? undefined
              : Number.parseInt(res.size, 10)
            : res.size,
        lastModified:
          res.last_modified || res.created || ckanPackage.metadata_modified,
        license:
          ckanPackage.license_title || ckanPackage.license_id || undefined,
      }),
    )

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

  private escapeSolrValue(value: string): string {
    // Escape Solr special characters and quote values with spaces
    const escaped = value.replace(/([+\-&|!(){}[\]^"~*?:\\/])/g, '\\$1')
    return escaped.includes(' ') ? `"${escaped}"` : escaped
  }

  async getDatasets(input: GetDatasetsInput): Promise<DatasetsResponse> {
    const page = input.page || 1
    const limit = input.limit || 12

    try {
      const queryParams: Record<string, string | number> = {
        rows: limit,
        start: (page - 1) * limit,
      }

      if (input.searchQuery) {
        // Use trailing wildcard for partial matching (e.g., "stud" matches "students")
        // Trailing wildcards are supported by Solr, leading wildcards are not
        const searchTerm = this.escapeSolrValue(input.searchQuery.trim())
        queryParams.q = `${searchTerm}*`
      }

      // Build CKAN filter query (fq) for server-side filtering
      const fqParts: string[] = []

      if (input.publishers && input.publishers.length > 0) {
        // CKAN uses organization name (slug) for filtering
        const orgFilter = input.publishers
          .map((p) => `organization:${this.escapeSolrValue(p)}`)
          .join(' OR ')
        fqParts.push(`(${orgFilter})`)
      }

      if (input.formats && input.formats.length > 0) {
        const formatFilter = input.formats
          .map((f) => `res_format:${this.escapeSolrValue(f)}`)
          .join(' OR ')
        fqParts.push(`(${formatFilter})`)
      }

      if (input.categories && input.categories.length > 0) {
        // Categories are typically stored as tags in CKAN
        const tagFilter = input.categories
          .map((c) => `tags:${this.escapeSolrValue(c)}`)
          .join(' OR ')
        fqParts.push(`(${tagFilter})`)
      }

      if (input.status && input.status.length > 0) {
        const statusFilter = input.status
          .map((s) => `state:${this.escapeSolrValue(s)}`)
          .join(' OR ')
        fqParts.push(`(${statusFilter})`)
      }

      if (input.license && input.license.length > 0) {
        const licenseFilter = input.license
          .map((l) => `license_id:${this.escapeSolrValue(l)}`)
          .join(' OR ')
        fqParts.push(`(${licenseFilter})`)
      }

      if (input.groups && input.groups.length > 0) {
        const groupFilter = input.groups
          .map((g) => `groups:${this.escapeSolrValue(g)}`)
          .join(' OR ')
        fqParts.push(`(${groupFilter})`)
      }

      if (input.lastUpdated) {
        const now = new Date()
        let fromDate: Date | undefined
        switch (input.lastUpdated) {
          case 'week':
            fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case 'month':
            fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            break
          case 'quarter':
            fromDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
            break
          case 'year':
            fromDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
            break
        }
        if (fromDate) {
          fqParts.push(`metadata_modified:[${fromDate.toISOString()} TO NOW]`)
        }
      }

      if (input.timePeriod && input.timePeriod.length > 0) {
        const oldestExplicitYear = new Date().getFullYear() - 4
        const timeParts = input.timePeriod.map((tp) => {
          if (tp === 'older') {
            return `metadata_modified:[* TO ${
              oldestExplicitYear - 1
            }-12-31T23:59:59Z]`
          }
          return `metadata_modified:[${tp}-01-01T00:00:00Z TO ${tp}-12-31T23:59:59Z]`
        })
        fqParts.push(`(${timeParts.join(' OR ')})`)
      }

      if (fqParts.length > 0) {
        queryParams.fq = fqParts.join(' AND ')
      }

      const response = await firstValueFrom(
        this.httpService.get(`${this.config.basePath}/package_search`, {
          params: queryParams,
          timeout: 10000,
          headers: {
            Accept: 'application/json',
          },
          httpsAgent: this.httpsAgent,
        }),
      )

      if (response.data.success && response.data.result) {
        const datasets = response.data.result.results.map((pkg: CKANPackage) =>
          this.mapCKANToDataset(pkg),
        )

        // Server-side filtering is now done via fq parameter
        // Only keep client-side filtering as fallback for edge cases
        return {
          datasets: datasets,
          total: response.data.result.count,
          page,
          limit,
          hasMore:
            (page - 1) * limit + datasets.length < response.data.result.count,
        }
      }

      return {
        datasets: [],
        total: 0,
        page,
        limit,
        hasMore: false,
      }
    } catch (error) {
      this.logger.error('Failed to fetch from CKAN API', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      })
      throw error
    }
  }

  async getDataset(id: string): Promise<Dataset | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.config.basePath}/package_show`, {
          params: { id },
          timeout: 10000,
          headers: {
            Accept: 'application/json',
          },
          httpsAgent: this.httpsAgent,
        }),
      )

      if (response.data.success && response.data.result) {
        return this.mapCKANToDataset(response.data.result)
      }

      return null
    } catch (error) {
      this.logger.error('Failed to fetch dataset from CKAN API', {
        id,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }

  async getFilters(): Promise<DatasetFilter[]> {
    try {
      // Fetch organizations, tags, licenses, and groups from CKAN
      const [orgsResponse, tagsResponse, licensesResponse, groupsResponse] =
        await Promise.all([
          firstValueFrom(
            this.httpService.get(`${this.config.basePath}/organization_list`, {
              params: { all_fields: true },
              timeout: 10000,
              headers: { Accept: 'application/json' },
              httpsAgent: this.httpsAgent,
            }),
          ),
          firstValueFrom(
            this.httpService.get(`${this.config.basePath}/tag_list`, {
              params: { all_fields: true },
              timeout: 10000,
              headers: { Accept: 'application/json' },
              httpsAgent: this.httpsAgent,
            }),
          ),
          firstValueFrom(
            this.httpService.get(`${this.config.basePath}/license_list`, {
              timeout: 10000,
              headers: { Accept: 'application/json' },
              httpsAgent: this.httpsAgent,
            }),
          ),
          firstValueFrom(
            this.httpService.get(`${this.config.basePath}/group_list`, {
              params: { all_fields: true },
              timeout: 10000,
              headers: { Accept: 'application/json' },
              httpsAgent: this.httpsAgent,
            }),
          ),
        ])

      // Get formats from a sample of datasets
      const datasetsResponse = await firstValueFrom(
        this.httpService.get(`${this.config.basePath}/package_search`, {
          params: { rows: 100 },
          timeout: 10000,
          headers: { Accept: 'application/json' },
          httpsAgent: this.httpsAgent,
        }),
      )

      const filters: DatasetFilter[] = []

      // Organizations (Stofnun / Ráðuneyti) - only include orgs with datasets
      if (orgsResponse.data.success && orgsResponse.data.result) {
        const orgs = orgsResponse.data.result.filter(
          (org: CKANOrganization) => (org.package_count || 0) > 0,
        ) // Only orgs with datasets
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
                label:
                  typeof tag === 'string' ? tag : tag.display_name || tag.name,
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
          options: Array.from(formats)
            .sort()
            .map((f) => ({
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
      const timePeriodCurrentYear = new Date().getFullYear()
      const timePeriodYears = Array.from({ length: 5 }, (_, i) => {
        const year = String(timePeriodCurrentYear - i)
        return { value: year, label: year }
      })
      filters.push({
        id: 'timePeriod',
        field: 'timePeriod',
        label: 'Tímabil gagna',
        options: [...timePeriodYears, { value: 'older', label: 'Eldra' }],
      })

      // License (Notkunarleyfi)
      if (licensesResponse.data.success && licensesResponse.data.result) {
        const licenses = licensesResponse.data.result
        filters.push({
          id: 'license',
          field: 'license',
          label: 'Notkunarleyfi',
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

      return filters
    } catch (error) {
      this.logger.error('Failed to fetch filters from CKAN API', {
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }

  async getPublishers(): Promise<Publisher[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.config.basePath}/organization_list`, {
          params: { all_fields: true },
          timeout: 10000,
          headers: { Accept: 'application/json' },
          httpsAgent: this.httpsAgent,
        }),
      )

      if (response.data.success && response.data.result) {
        return response.data.result
          .filter((org: CKANOrganization) => (org.package_count || 0) > 0)
          .map((org: CKANOrganization) => ({
            id: org.id || org.name,
            name: org.title || org.name,
          }))
      }

      return []
    } catch (error) {
      this.logger.error('Failed to fetch publishers from CKAN API', {
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }
}
