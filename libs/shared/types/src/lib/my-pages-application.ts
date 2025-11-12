import {
  ActionCardMetaData,
  ApplicationStatus,
  ApplicationTypes,
  InstitutionTypes,
} from '@island.is/application/types'
export interface MyPagesApplication {
  id: string
  created: Date
  modified: Date
  applicant: string
  assignees: string[]
  applicantActors: string[]
  state: string
  actionCard: ActionCardMetaData
  typeId: ApplicationTypes
  answers: object
  externalData: object
  progress: number
  name: string
  institution: string
  status: ApplicationStatus
  pruned: boolean
  formSystemFormSlug?: string
  formSystemOrgContentfulId?: string
  formSystemOrgSlug?: InstitutionTypes
}
