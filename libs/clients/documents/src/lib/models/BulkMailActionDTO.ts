export interface BulkMailActionDTO {
  ids: Array<string>
  action: 'bookmark' | 'archive' | 'read'
  status: boolean
}
