export interface BulkMailActionDTO {
  ids: Array<string>
  action: 'bookmark' | 'archive'
  status: boolean
}
