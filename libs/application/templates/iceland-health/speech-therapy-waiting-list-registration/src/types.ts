import {
  Address,
  ApplicantChildCustodyInformationV3,
} from '@island.is/application/types'

export type Guardian = {
  fullName: string
  nationalId: string
  email: string
  phoneNumber: string
}

export type Child = ApplicantChildCustodyInformationV3 & {
  address?: Address | null
}
