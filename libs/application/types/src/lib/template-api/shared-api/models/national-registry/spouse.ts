export interface NationalRegistrySpouse {
  name: string
  nationalId: string
  maritalStatus: string
  maritalTitle?: {
    code?: string | null,
    description?: string | null
  } | null
}
