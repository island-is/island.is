import {
  Address,
  ApplicantChildCustodyInformationV3,
} from '@island.is/application/types'

export type Child = ApplicantChildCustodyInformationV3 & {
  address?: Address | null
}
