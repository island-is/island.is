import * as Types from '@island.is/api/schema'
import { ActionCardMetaData } from '@island.is/api/schema'

export interface AdminApplication {
  id: string
  typeId: Types.ApplicationListAdminResponseDtoTypeIdEnum
  applicant: string
  state: string
  created: string
  modified: string
  name?: string | null
  institution?: string | null
  progress?: number | null
  actionCard?: ActionCardMetaData | null
  assignees: Array<string>
  applicantActors: Array<string>
  status: Types.ApplicationListAdminResponseDtoStatusEnum
  applicantName?: string | null
  paymentStatus?: string | null
}
