import { Gender } from './gender.enum'
import { MaritalStatus } from './maritalStatus.enum'

export interface User {
  nationalId: string
  fullName: string
  citizenship: string
  gender: Gender
  maritalStatus: MaritalStatus
  houseCode: string
  municipalCode: string
}
