export interface CategoryResponse {
  id: number
  name: string
  description?: string
}

export interface SearchResponse {
  id: number
  type: number
  category_id: number
  folder_id: number
  folder_visibility: number
  agent_id: number
  path: string
  language_id: number
  title: string
  status: number
  description: string
  description_text: string
  category_name: string
  folder_name: string
}
