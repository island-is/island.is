export interface Machine {
  id?: string
  registrationNumber?: string | null
  type?: string | null
  owner?: string | null
  supervisor?: string | null
  status?: string | null
  dateLastInspection?: string | null
}
