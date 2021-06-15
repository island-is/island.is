import { DocumentClientConfig } from '@island.is/clients/documents'

export interface DocumentsConfig {
  documentClientConfig: DocumentClientConfig
  downloadServiceConfig: DownloadServiceConfig
}

export interface DownloadServiceConfig {
  downloadServiceBaseUrl?: string
}

export const DOWNLOAD_SERVICE_CONFIG = 'DOWNLOAD_SERVICE_CONFIG'
