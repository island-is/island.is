import { Gender } from './gender.enum'
import { MartialStatus } from './maritalStatus.enum'

export interface User {
  nationalId: string
  fullName: string
  citizenship: string
  gender: Gender
  maritalStatus: MartialStatus
  houseCode: string
  municipalCode: string
}
