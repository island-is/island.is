import { DocumentInfo } from '@island.is/clients/data-protection-complaint'

export interface FileProvider {
  getFiles(): Promise<DocumentInfo[]>
}
