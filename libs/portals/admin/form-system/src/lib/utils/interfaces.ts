import { UniqueIdentifier } from "@dnd-kit/core"
import { FormSystemStep, FormSystemGroup, FormSystemInput, FormSystemLanguageType, FormSystemLanguageTypeInput } from "@island.is/api/schema"


export enum NavbarSelectStatus {
  OFF = 'Off',
  NORMAL = 'Normal',
  LIST_ITEM = 'ListItem',
  ON_WITHOUT_SELECT = 'OnWithoutSelect',
}

export type ItemType = 'Step' | 'Group' | 'Input'

export interface ActiveItem {
  type: ItemType
  data?: FormSystemStep | FormSystemGroup | FormSystemInput | null
}

export interface IListItem {
  guid: UniqueIdentifier
  label: FormSystemLanguageType | FormSystemLanguageTypeInput
  description: FormSystemLanguageType | FormSystemLanguageTypeInput
  displayOrder: number
  isSelected: boolean
}

export enum EFormApplicantTypes {
  einstaklingur = 'Einstaklingur',
  einstaklingurMedUmbodAnnarsEinstaklings = 'Einstaklingur_með_umboð_annars_einstaklings',
  einstaklingurMedUmbodLogadila = 'Einstaklingur_með_umboð_lögaðila',
  einstaklingurMedProkuru = 'Einstaklingur_með_prókúru',
  einstaklingurUmbodsveitandi = 'Einstaklingur_umboðsveitandi',
  logadili = 'Lögaðili',
}
