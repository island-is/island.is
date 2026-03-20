import * as Types from '@island.is/api/schema'
import { ActionCardMetaData, ApplicationAdminData } from '@island.is/api/schema'

export interface AdminApplication {
  id: string
  isFormSystem?: boolean
  typeId: string
  formSlug?: string
  applicant: string
  state: string
  created: string
  modified: string
  name?: string
  institution?: string
  pruned?: boolean
  pruneAt?: string
  progress?: number
  actionCard?: ActionCardMetaData
  assignees: Array<string>
  applicantActors: Array<string>
  status: Types.ApplicationListAdminResponseDtoStatusEnum
  applicantName?: string
  paymentStatus?: string
  adminData?: Array<ApplicationAdminData>
  institutionContentfulSlug?: string
}
