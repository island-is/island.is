import * as Types from '@island.is/api/schema'
import { ActionCardMetaData } from '@island.is/api/schema'

export interface AdminApplication {
  id: string
  typeId: Types.ApplicationListAdminResponseDtoTypeIdEnum
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
}
