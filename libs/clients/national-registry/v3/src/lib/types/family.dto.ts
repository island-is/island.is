import {
  EinstaklingurDTOLogForeldriItem,
  EinstaklingurDTOLogforeldrar,
} from '../../../gen/fetch'

export interface FamilyDto {
  parents: Array<FamilyMember> | null
  children: Array<FamilyMember> | null
}

export interface FamilyMember {
  nationalId: string | null
  name: string | null
  dateOfBirth: Date | null
}
