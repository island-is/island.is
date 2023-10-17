import { ISLBorninMin } from '@island.is/clients/national-registry-v1'

export interface FamilyChild {
  nationalId: string // Barn
  fullName: string // FulltNafn
  displayName?: string // BirtNafn
  firstName?: string // Eiginnafn
  middleName?: string // Millinafn
  surname?: string // Kenninafn
  lastName?: string // Kenninafn
  gender?: string // Kyn
  genderDisplay?: string // Kynheiti
  birthday?: string // Faedingardagur
  parent1?: string // Foreldri1
  nameParent1?: string // NafnForeldri1
  parent2?: string // Foreldri2
  nameParent2?: string // NafnForeldri2
  custody1?: string // Forsja1
  nameCustody1?: string // NafnForsja1
  custodyText1?: string // Forsjatxt1
  custody2?: string // Forsja2
  nameCustody2?: string // NafnForsja2
  custodyText2?: string // Forsjatxt2
  birthplace?: string // Faedingarstadur
  religion?: string // Trufelag
  nationality?: string // Rikisfang
  homeAddress?: string // Logheimili
  municipality?: string // Sveitarfelag
  postal?: string // Postaritun
}
export function formatFamilyChild(
  familyChild: ISLBorninMin | null | undefined,
): FamilyChild | null {
  if (!familyChild) {
    return null
  }

  return {
    fullName: familyChild.FulltNafn,
    nationalId: familyChild.Barn,
    gender: familyChild.Kyn,
    displayName: familyChild.BirtNafn,
    firstName: familyChild.Eiginnafn,
    lastName: familyChild.Kenninafn,
    middleName: familyChild.Millinafn,
    surname: familyChild.Kenninafn,
    genderDisplay: familyChild.Kynheiti,
    birthday: familyChild.Faedingardagur,
    parent1: familyChild.Foreldri1,
    nameParent1: familyChild.NafnForeldri1,
    parent2: familyChild.Foreldri2,
    nameParent2: familyChild.NafnForeldri2,
    custody1: familyChild.Forsja1,
    nameCustody1: familyChild.NafnForsja1,
    custodyText1: familyChild.Forsjatxt1,
    custody2: familyChild.Forsja2,
    nameCustody2: familyChild.NafnForsja2,
    custodyText2: familyChild.Forsjatxt2,
    birthplace: familyChild.Faedingarstadur,
    religion: familyChild.Trufelag,
    nationality: familyChild.Rikisfang,
    homeAddress: familyChild.Logheimili,
    municipality: familyChild.Sveitarfelag,
    postal: familyChild.Postaritun,
  }
}
